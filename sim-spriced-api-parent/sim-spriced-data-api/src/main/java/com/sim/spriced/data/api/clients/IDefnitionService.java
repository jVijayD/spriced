package com.sim.spriced.data.api.clients;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.sim.spriced.data.api.dto.EntityDto;
import com.sim.spriced.data.api.dto.RuleDto;
import com.sim.spriced.framework.api.interceptors.FeignClientConfig;



@FeignClient(name = "spriced-defnition-api",url="${spriced-defnition-api.url}",configuration = FeignClientConfig.class, fallback = DefnitionServiceFallback.class)
public interface IDefnitionService {
	@GetMapping("/entities/{id}")
	public ResponseEntity<EntityDto> getEntityById(@PathVariable int id);
	
	
	@GetMapping("/entities/{id}/rules")
	public ResponseEntity<List<RuleDto>> getRuleByEntityId(@PathVariable int id);
	
	
}
