package com.sim.spriced.framework.api.interceptors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.HandlerInterceptor;

import com.sim.spriced.framework.context.ContextManager;
import com.sim.spriced.framework.context.RequestContext;

public class HeaderInterceptor implements HandlerInterceptor {
	
	@Autowired
	ContextManager contextManager;
	
	HeaderInterceptor(){
		int i =0;
	}
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		String tenant = request.getHeader("tenant");
		String user = request.getHeader("user");
		String txId = request.getHeader("txId");
		
		RequestContext context = new RequestContext(txId,tenant,user);
		contextManager.setRequestContext(context);

		
		return true;
	}
}
