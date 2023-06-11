package com.sim.spriced.framework.repo;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.sql.DataSource;

import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.jooq.ConnectionProvider;
import org.jooq.DSLContext;
import org.jooq.ExecuteContext;
import org.jooq.SQLDialect;
import org.jooq.conf.MappedSchema;
import org.jooq.conf.RenderMapping;
import org.jooq.conf.RenderNameCase;
import org.jooq.conf.RenderQuotedNames;
import org.jooq.conf.Settings;
import org.jooq.impl.DataSourceConnectionProvider;
import org.jooq.impl.DefaultConfiguration;
import org.jooq.impl.DefaultDSLContext;
import org.jooq.impl.DefaultExecuteListener;
import org.jooq.impl.DefaultExecuteListenerProvider;
import org.springframework.aop.framework.ProxyFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.jdbc.datasource.TransactionAwareDataSourceProxy;
import org.springframework.jdbc.support.SQLErrorCodeSQLExceptionTranslator;
import org.springframework.jdbc.support.SQLExceptionTranslator;
import org.springframework.transaction.TransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.sim.spriced.framework.context.SPricedContextManager;

/***
 * Bean Configuration class for JOOQ and related entities
 * 
 * @author shabeeb
 *
 */
@Configuration
@EnableTransactionManagement
public class RepoConfiguration {

	// Read the dialect from the application property files.
	@Value("${spring.jooq.sql-dialect}")
	private String sqlDialect;

	@Autowired
	DataSource dataSource;

	/***
	 * JOOQ DSL context bean creation. DSLContext will be created inside a map based
	 * on tenant name and retreive it based on the tenant name passed in header.JOOQ
	 * related configurations will be set inside this method.
	 * 
	 * @param contextManager
	 * @return DSLContext
	 */
	@Bean
	public DSLContext dsl(SPricedContextManager contextManager) {

		return ProxyFactory.getProxy(DSLContext.class, new MethodInterceptor() {

			Map<String, DSLContext> contextMap = new ConcurrentHashMap<>();

			@Override
			public Object invoke(MethodInvocation invocation) throws Throwable {

				DSLContext ctx = contextMap.computeIfAbsent(contextManager.getRequestContext().getTenant(), key -> {
					Settings settings = new Settings().withReturnAllOnUpdatableRecord(true).withRenderMapping(
							new RenderMapping().withSchemata(new MappedSchema().withInput("master").withOutput(key)));

					// .withExecuteWithOptimisticLocking(true)
					settings.setRenderQuotedNames(RenderQuotedNames.ALWAYS);
					settings.setRenderNameCase(RenderNameCase.LOWER);

					DefaultConfiguration jooqConfiguration = new DefaultConfiguration();
					SQLDialect dialect = SQLDialect.valueOf(sqlDialect);
					jooqConfiguration.setSQLDialect(dialect);
					jooqConfiguration.setConnectionProvider(connectionProvider());

					jooqConfiguration.setSettings(settings);
					jooqConfiguration
							.setExecuteListenerProvider(new DefaultExecuteListenerProvider(new ExceptionTranslator()));

					return new DefaultDSLContext(jooqConfiguration);
				});

				return invocation.getMethod().invoke(ctx, invocation.getArguments());
			}

		});
	}

	@Bean
	public TransactionManager transactionManager() {
		DataSourceTransactionManager transactionManager = new DataSourceTransactionManager();
		transactionManager.setDataSource(dataSource);
		transactionManager.setRollbackOnCommitFailure(true);
		return transactionManager;
	}

	@Bean
	public ConnectionProvider connectionProvider() {
		TransactionAwareDataSourceProxy transactionAwareDataSourceProxy = new TransactionAwareDataSourceProxy(
				dataSource);
		return new DataSourceConnectionProvider(transactionAwareDataSourceProxy);
	}

//	@Bean
//	@Primary
//	public PlatformTransactionManager transactionManager() {
//		JpaTransactionManager transactionManager = new JpaTransactionManager();
//		transactionManager.setDataSource(dataSource);
//		transactionManager.setRollbackOnCommitFailure(true);
//        transactionManager.setGlobalRollbackOnParticipationFailure(true);
//		//transactionManager.setEntityManagerFactory(emf);
//		return transactionManager;
//	}
//
//	@Bean
//	@Primary
//	public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
//
//		Map<String, Object> properties = new HashMap<>();
//		JpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
//		
//	
//        properties.put(org.hibernate.cfg.Environment.MULTI_TENANT, MultiTenancyStrategy.DATABASE); // or DATABASE
//        properties.put(org.hibernate.cfg.Environment.MULTI_TENANT_CONNECTION_PROVIDER, connectionProvider());
//        //properties.put(org.hibernate.cfg.Environment.MULTI_TENANT_IDENTIFIER_RESOLVER, currentTenantIdentifier
//        		
//		LocalContainerEntityManagerFactoryBean emfBean = new LocalContainerEntityManagerFactoryBean();
//		
//		emfBean.setDataSource(dataSource);
//		emfBean.setJpaVendorAdapter(vendorAdapter);
//		emfBean.setPackagesToScan("com.sim.spriced");
//		emfBean.setJpaPropertyMap(properties);
//		
//		//properties.put(MULTI_TENANT, MultiTenancyStrategy.DATABASE);
//		
//		
//		
//		
//		
//		return emfBean;
//	}

	class ExceptionTranslator extends DefaultExecuteListener {

		private static final long serialVersionUID = 1L;

		@Override
		public void exception(ExecuteContext context) {
			SQLDialect dialect = context.configuration().dialect();
			SQLExceptionTranslator translator = new SQLErrorCodeSQLExceptionTranslator(dialect.name());
			context.exception(
					translator.translate("Access database using Jooq", context.sql(), context.sqlException()));
		}
	}
}
