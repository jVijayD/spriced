package com.sim.spriced.framework.caching;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;

@Component
public class CacheService {

	@Autowired
	CacheManager cacheManager;
	

}
