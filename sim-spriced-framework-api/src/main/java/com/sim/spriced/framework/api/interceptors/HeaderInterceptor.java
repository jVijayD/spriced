package com.sim.spriced.framework.api.interceptors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.HandlerInterceptor;

import com.sim.spriced.framework.context.SPricedContextManager;
import com.sim.spriced.framework.context.RequestContext;

/***
 * Interceptor to read tenant,user,txId,roles and application from header.
 * @author shabeeb
 *
 */
public class HeaderInterceptor implements HandlerInterceptor {
	
	private static final String EXTENSION="";//X-Kong-Jwt-Claim-
	private static final String TENANT = "tenant";
	private static final String USER = "user";
	private static final String TRANSACTION_ID = "transactionId";
	private static final String ROLES = "roles";
	private static final String APPLICATIONS = "applications";

	@Autowired
	SPricedContextManager contextManager;
	
	@Autowired
	RequestContext requestContext;

	/***
	 * Handler to read the header.
	 */
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		String tenant = request.getHeader(EXTENSION+TENANT);
		String user = request.getHeader(EXTENSION+USER);
		String txId = request.getHeader(EXTENSION+TRANSACTION_ID);
		String[] roles = request.getHeader(EXTENSION+ROLES) != null ? request.getHeader(EXTENSION+ROLES).split(",") : new String[0];
		String[] applications = request.getHeader(EXTENSION+APPLICATIONS) != null ? request.getHeader(EXTENSION+APPLICATIONS).split(",")
				: new String[0];

		requestContext.setApplications(applications);
		requestContext.setRoles(roles);
		requestContext.setTenant(tenant);
		requestContext.setTransactionId(txId);
		requestContext.setUser(user);
		
		contextManager.setRequestContext(requestContext);

		return true;
	}
}
