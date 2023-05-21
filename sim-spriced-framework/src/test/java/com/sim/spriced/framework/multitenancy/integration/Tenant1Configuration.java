package com.sim.spriced.framework.multitenancy.integration;

import org.springframework.context.annotation.Bean;

import com.sim.spriced.framework.context.ContextManager;
import com.sim.spriced.framework.context.RequestContext;
import com.sim.spriced.framework.multitenancy.ITenantManager;

public class Tenant1Configuration {
	private static final String TENANT ="meritor";
	@Bean
	public ContextManager contextManager() {
		ContextManager contextManager = new ContextManager();
		RequestContext context = new RequestContext();
		context.setTenant(TENANT);
		contextManager.setRequestContext(context);
		return contextManager;
	}
	
	@Bean
	public ITenantManager getTenantManager(ContextManager contextManager) {
		return new ITenantManager() {

			@Override
			public String getTenant() {
				// TODO Auto-generated method stub
				return contextManager.getRequestContext().getTenant();
			}
			
		};
	}
}
