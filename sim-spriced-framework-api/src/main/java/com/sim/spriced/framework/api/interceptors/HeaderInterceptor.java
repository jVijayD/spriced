package com.sim.spriced.framework.api.interceptors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.HandlerInterceptor;

import com.sim.spriced.framework.context.SPricedContextManager;
import com.sim.spriced.framework.context.RequestContext;

public class HeaderInterceptor implements HandlerInterceptor {

	@Autowired
	SPricedContextManager contextManager;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		String tenant = request.getHeader("tenant");
		String user = request.getHeader("user");
		String txId = request.getHeader("txId");
		String[] roles = request.getHeader("roles") != null ? request.getHeader("roles").split(",") : new String[0];
		String[] applications = request.getHeader("applications") != null ? request.getHeader("applications").split(",")
				: new String[0];

		RequestContext context = new RequestContext(txId, tenant, user, roles, applications);
		contextManager.setRequestContext(context);

		return true;
	}
}
