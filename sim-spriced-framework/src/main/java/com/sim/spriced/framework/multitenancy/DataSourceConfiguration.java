package com.sim.spriced.framework.multitenancy;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSourceConfiguration {
	
	@Bean
	public DataSource currentTenantDataSource(TenantDataSourcesConfigProps dataSources) {
		TenantRoutingDataSource routingDataSource = new TenantRoutingDataSource();
		routingDataSource.setTargetDataSources(dataSources.getTenantDataSource());
		return routingDataSource;
	}
}
