package com.sim.spriced.framework.api;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.annotation.RequestScope;

import com.sim.spriced.framework.context.RequestContext;
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
		SPricedContextManager contextManager = new SPricedContextManager();
		contextManager.setRequestContext(requestContext());
		return contextManager;
	}

	/***
	 * Method to create requestContext bean holding the user and tenant details
	 * @return
	 */
	@Bean
	@RequestScope
	public RequestContext requestContext() {
		return new RequestContext();
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
