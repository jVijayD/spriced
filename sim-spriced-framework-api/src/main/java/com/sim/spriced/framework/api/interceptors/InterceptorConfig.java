package com.sim.spriced.framework.api.interceptors;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class InterceptorConfig implements WebMvcConfigurer {
	@Override
	public void addInterceptors(final InterceptorRegistry registry) {
		registry.addInterceptor(headerInterceptor());
	}

	@Bean
	public HeaderInterceptor headerInterceptor() {
		return new HeaderInterceptor();
	}
}
