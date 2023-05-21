package com.sim.spriced.framework.multitenancy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;


public class TenantRoutingDataSource extends AbstractRoutingDataSource {

	@Autowired
	ITenantManager tenenantManager;
	
	@Override
	protected Object determineCurrentLookupKey() {
		return tenenantManager.getTenant();
	}

}
