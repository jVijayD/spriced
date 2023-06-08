package com.sim.spriced.framework.api;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.sim.spriced.framework.context.ContextManager;
import com.sim.spriced.framework.context.RequestContext;
import com.sim.spriced.framework.multitenancy.ITenantManager;

@Configuration
public class ContextConfig {

	@Bean
	public ContextManager contextManager() {
		ContextManager contextManager = new ContextManager();
		RequestContext context = new RequestContext();
		
		contextManager.setRequestContext(context);
		
		contextManager.getRequestContext().setTenant("meritor");
		contextManager.getRequestContext().setUser("user");
		contextManager.getRequestContext().setTransactionId("1");
		return contextManager;
	}

	@Bean
	public ITenantManager getTenantManager(ContextManager contextManager) {
		return new ITenantManager() {

			@Override
			public String getTenant() {
				return contextManager.getRequestContext().getTenant();
			}

		};
	}

}
