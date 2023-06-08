package com.sim.spriced.framework.multitenancy;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
@ConfigurationProperties(prefix = "tenants")
@PropertySource("classpath:tenants.properties")
public class TenantDataSourcesConfigProps {

	private static final String JDBC_URL = "jdbcUrl";
	private static final String DRIVER_CLASS_NAME = "driverClassName";
	private static final String USER_NAME = "username";
	private static final String PASSWORD = "password";
	private static final String MAX_CONNECTION_POOL = "maxPoolSize";
	private static final String VALIDATION_QUERY = "validationQuery";
	private static final String MAX_LIFE_TIME = "maxLifetime";
	private static final String IDLE_TIMEOUT = "idleTimeout";
	private static final String CONNECTION_TIMEOUT = "connectionTimeout";

	private Map<String, Map<String, String>> dbSources = new LinkedHashMap<>();
	private static Map<Object, Object> tenantDBSources = new LinkedHashMap<>();

	public Map<String, Map<String, String>> getDatasources() {
		return dbSources;
	}

	public Map<Object, Object> getTenantDataSource() {
		if (tenantDBSources.size() == 0) {
			dbSources.forEach((key, value) -> tenantDBSources.put(key, createTenantDatasource(value)));
		}
		return tenantDBSources;
	}

	private DataSource createTenantDatasource(Map<String, String> source) {

		HikariConfig config = new HikariConfig();

		config.setJdbcUrl(source.get(JDBC_URL));
		config.setDriverClassName(source.get(DRIVER_CLASS_NAME));
		config.setUsername(source.get(USER_NAME));
		config.setPassword(source.get(PASSWORD));

		if (StringUtils.isNotEmpty(source.get(MAX_CONNECTION_POOL))) {
			Integer connectionPool = Integer.parseInt(source.get(MAX_CONNECTION_POOL));
			config.setMaximumPoolSize(connectionPool);
		}

		if (StringUtils.isNotEmpty(source.get(VALIDATION_QUERY))) {
			config.setConnectionTestQuery(source.get(VALIDATION_QUERY));
		}

		if (StringUtils.isNotEmpty(source.get(MAX_LIFE_TIME))) {
			Long maxLifeTime = Long.parseLong(source.get(MAX_LIFE_TIME));
			config.setMaxLifetime(maxLifeTime);
		}

		if (StringUtils.isNotEmpty(source.get(CONNECTION_TIMEOUT))) {
			Long connectionTimeOut = Long.parseLong(source.get(CONNECTION_TIMEOUT));
			config.setConnectionTimeout(connectionTimeOut);
		}

		if (StringUtils.isNotEmpty(source.get(IDLE_TIMEOUT))) {
			Long idleTimeOut = Long.parseLong(source.get(IDLE_TIMEOUT));
			config.setIdleTimeout(idleTimeOut);
		}

		return new HikariDataSource(config);
	}
}
