package com.sim.spriced.framework.caching;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@ConfigurationProperties(prefix = "tenants")
@PropertySource("classpath:tenants.properties")
public class TenantCachingSourceConfigProps {
	private Map<String, Map<String, String>> cacheSources = new LinkedHashMap<>();
	private static Map<Object, Object> tenantCacheSources = new LinkedHashMap<>();
	
	
	public Map<String, Map<String, String>> getCacheSources() {
		return cacheSources;
	}

	public Map<Object, Object> getTenantCacheSource() {
		if (tenantCacheSources.size() == 0) {
			cacheSources.forEach((key, value) -> tenantCacheSources.put(key, this.createTenantCacheSource()));
		}
		return tenantCacheSources;
	}
	
	private CacheManager createTenantCacheSource() {
		return null;
	}
}
