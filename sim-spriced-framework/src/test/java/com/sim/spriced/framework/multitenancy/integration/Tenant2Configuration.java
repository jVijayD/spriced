package com.sim.spriced.framework.multitenancy.integration;

import org.springframework.context.annotation.Bean;

import com.sim.spriced.framework.context.SPricedContextManager;
import com.sim.spriced.framework.context.RequestContext;
import com.sim.spriced.framework.multitenancy.ITenantManager;

public class Tenant2Configuration {
	private static final String TENANT ="mds";
	@Bean
	public SPricedContextManager contextManager() {
		SPricedContextManager contextManager = new SPricedContextManager();
		RequestContext context = new RequestContext();
		context.setTenant(TENANT);
		contextManager.setRequestContext(context);
		return contextManager;
	}
	
	@Bean
	public ITenantManager getTenantManager(SPricedContextManager contextManager) {
		return new ITenantManager() {

			@Override
			public String getTenant() {
				// TODO Auto-generated method stub
				return contextManager.getRequestContext().getTenant();
			}
			
		};
	}
}
