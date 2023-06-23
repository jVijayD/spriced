package com.sim.spriced.framework.repo;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import javax.annotation.PostConstruct;
import javax.sql.DataSource;
import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.apache.commons.lang3.StringUtils;
import org.flywaydb.core.Flyway;
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
import com.sim.spriced.framework.exceptions.data.TenantNotPresentException;
import com.sim.spriced.framework.multitenancy.TenantDataSourcesConfigProps;

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

	@Value("${spring.flyway.migrate.db}")
	private boolean migrate = false;

	@Autowired
	DataSource dataSource;

	TenantDataSourcesConfigProps tenantDataSourceConfigProps;

	public RepoConfiguration(TenantDataSourcesConfigProps tenantDataSourceConfigProps) {
		this.tenantDataSourceConfigProps = tenantDataSourceConfigProps;
	}

	/***
	 * JOOQ DSL context bean creation. DSLContext will be created inside a map based
	 * on tenant name and retreive it based on the tenant name passed in header.JOOQ
	 * related configurations will be set inside this method.
	 * 
	 * @param contextManager
	 * @return DSLContext
	 */
	@Bean
	DSLContext dsl(SPricedContextManager contextManager) {

		return ProxyFactory.getProxy(DSLContext.class, new MethodInterceptor() {

			Map<String, DSLContext> contextMap = new ConcurrentHashMap<>();

			@Override
			public Object invoke(MethodInvocation invocation) throws Throwable {

				String tenant = contextManager.getRequestContext().getTenant();
				if(StringUtils.isEmpty(tenant)) {
					throw new TenantNotPresentException("TenantId missing in the context.");
				}
				DSLContext ctx = contextMap.computeIfAbsent(tenant, key -> {
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

	/**
	 * Method creating the transaction manager for JOOQ
	 * 
	 * @return
	 */
	@Bean
	TransactionManager transactionManager() {
		DataSourceTransactionManager transactionManager = new DataSourceTransactionManager();
		transactionManager.setDataSource(dataSource);
		transactionManager.setRollbackOnCommitFailure(true);
		return transactionManager;
	}

	/**
	 * Method creating connection provider with transactions
	 * 
	 * @return
	 */
	@Bean
	ConnectionProvider connectionProvider() {
		TransactionAwareDataSourceProxy transactionAwareDataSourceProxy = new TransactionAwareDataSourceProxy(
				dataSource);
		return new DataSourceConnectionProvider(transactionAwareDataSourceProxy);
	}

	/**
	 * Method to migrate the DB using flyway
	 */
	@PostConstruct
	public void migrate() {
		if (migrate) {
			this.tenantDataSourceConfigProps.getTenantDataSource().values().forEach(source -> {
				DataSource flywaySource = (DataSource) source;
				Flyway flyway = Flyway.configure().dataSource(flywaySource).load();
				flyway.migrate();
			});
		}
	}

	/***
	 * Class implementing Exception translator for JOOQ
	 * 
	 * @author shabeeb
	 *
	 */
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
