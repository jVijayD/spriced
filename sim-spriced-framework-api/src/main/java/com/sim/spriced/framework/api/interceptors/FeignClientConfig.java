package com.sim.spriced.framework.api.interceptors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;

import com.sim.spriced.framework.api.interceptors.HeaderInterceptor;
import com.sim.spriced.framework.context.SPricedContextManager;

import feign.RequestInterceptor;
import feign.okhttp.OkHttpClient;

public class FeignClientConfig {
	
	@Autowired
	SPricedContextManager contextManager;
	
	@Bean
    public OkHttpClient client() {
        return new OkHttpClient();
    }
	
	@Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            requestTemplate.header("Content-Type", "application/json");
            requestTemplate.header("Accept", "application/json");
            requestTemplate.header(HeaderInterceptor.APPLICATIONS, contextManager.getRequestContext().getApplications());
            requestTemplate.header(HeaderInterceptor.ROLES, contextManager.getRequestContext().getRoles());
            requestTemplate.header(HeaderInterceptor.TENANT, contextManager.getRequestContext().getTenant());
            requestTemplate.header(HeaderInterceptor.TRANSACTION_ID, contextManager.getRequestContext().getTransactionId());
            requestTemplate.header(HeaderInterceptor.USER, contextManager.getRequestContext().getUser());
        };
    }
}
