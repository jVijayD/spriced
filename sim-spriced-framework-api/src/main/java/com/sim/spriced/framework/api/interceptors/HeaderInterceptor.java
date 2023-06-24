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
	
	public static final String EXTENSION="";//X-Kong-Jwt-Claim-
	public static final String TENANT = EXTENSION+"tenant";
	public static final String USER = EXTENSION+"user";
	public static final String TRANSACTION_ID = EXTENSION+"transactionId";
	public static final String ROLES = EXTENSION+"roles";
	public static final String APPLICATIONS = EXTENSION+"applications";

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
		String tenant = request.getHeader(TENANT);
		String user = request.getHeader(USER);
		String txId = request.getHeader(TRANSACTION_ID);
		String[] roles = request.getHeader(ROLES) != null ? request.getHeader(ROLES).split(",") : new String[0];
		String[] applications = request.getHeader(APPLICATIONS) != null ? request.getHeader(APPLICATIONS).split(",")
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
