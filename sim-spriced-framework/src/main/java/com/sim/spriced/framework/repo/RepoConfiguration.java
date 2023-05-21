package com.sim.spriced.framework.repo;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.sql.DataSource;

import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.jooq.ConnectionProvider;
import org.jooq.DSLContext;
import org.jooq.SQLDialect;
import org.jooq.conf.MappedSchema;
import org.jooq.conf.RenderMapping;
import org.jooq.conf.RenderNameCase;
import org.jooq.conf.RenderQuotedNames;
import org.jooq.conf.Settings;
import org.jooq.impl.DataSourceConnectionProvider;
import org.jooq.impl.DefaultConfiguration;
import org.jooq.impl.DefaultDSLContext;
import org.springframework.aop.framework.ProxyFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.TransactionAwareDataSourceProxy;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.sim.spriced.framework.context.ContextManager;

@Configuration
@EnableTransactionManagement
public class RepoConfiguration {

	@Value("${spring.jooq.sql-dialect}")
	private String sqlDialect;
	

	
	@Autowired
	DataSource dataSource;
	
	
	@Bean
	public DSLContext dsl(ContextManager contextManager){
		
		return ProxyFactory.getProxy(DSLContext.class, new MethodInterceptor() {
			
			Map<String, DSLContext> contextMap = new ConcurrentHashMap<>();
			@Override
			public Object invoke(MethodInvocation invocation) throws Throwable {
				DSLContext ctx=contextMap.computeIfAbsent(contextManager.getRequestContext().getTenant(),key->{
					Settings settings = new Settings().withRenderMapping(new RenderMapping().withSchemata(new MappedSchema().withInput("master").withOutput(key)));
					//.withExecuteWithOptimisticLocking(true)
					settings.setRenderQuotedNames(RenderQuotedNames.ALWAYS);
					settings.setRenderNameCase(RenderNameCase.LOWER);
					
					DefaultConfiguration jooqConfiguration = new DefaultConfiguration();
					SQLDialect dialect = SQLDialect.valueOf(sqlDialect);
					jooqConfiguration.setSQLDialect(dialect);
					jooqConfiguration.setConnectionProvider(connectionProvider());
					jooqConfiguration.setSettings(settings);
					
					return new DefaultDSLContext(jooqConfiguration);
				});
				
				return invocation.getMethod().invoke(ctx, invocation.getArguments());
			}
			
		});
	}
	
	private ConnectionProvider connectionProvider() {
		TransactionAwareDataSourceProxy transactionAwareDataSourceProxy = new TransactionAwareDataSourceProxy (dataSource);
		return new DataSourceConnectionProvider(transactionAwareDataSourceProxy);
	}
}
