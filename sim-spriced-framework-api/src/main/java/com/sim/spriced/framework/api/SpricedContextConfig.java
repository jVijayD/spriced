package com.sim.spriced.framework.api;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.sim.spriced.framework.context.SPricedContextManager;
import com.sim.spriced.framework.multitenancy.ITenantManager;

/***
 * Configuration class for creating the context bean,Swagger ....
 * 
 * @author shabeeb
 *
 */
@Configuration
public class SpricedContextConfig {

	/***
	 * ContextManager bean creation method.
	 * 
	 * @return
	 */
	@Bean
	public SPricedContextManager contextManager() {
		return new SPricedContextManager();
	}

	/***
	 * Method creating the tenant manager which helps to get the current logged in
	 * tenant.
	 * 
	 * @param contextManager
	 * @return
	 */
	@Bean
	public ITenantManager getTenantManager(SPricedContextManager contextManager) {
		return new ITenantManager() {

			@Override
			public String getTenant() {
				return contextManager.getRequestContext().getTenant();
			}

		};
	}

}
