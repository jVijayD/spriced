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
	
	private static final String TENANT = "tenant";
	private static final String USER = "user";
	private static final String TRANSACTION_ID = "transactionId";
	private static final String ROLES = "roles";
	private static final String APPLICATIONS = "applications";

	@Autowired
	SPricedContextManager contextManager;

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

		RequestContext context = new RequestContext(txId, tenant, user, roles, applications);
		contextManager.setRequestContext(context);

		return true;
	}
}
