package com.sim.spriced.data.api.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.sim.spriced.data.api.dto.EntityDto;
import com.sim.spriced.framework.api.interceptors.FeignClientConfig;



@FeignClient(name = "spriced-defnition-api",url="${spriced-defnition-api.url}",configuration = FeignClientConfig.class, fallback = IDefnitionService.DefnitionServiceFallback.class)
public interface IDefnitionService {
	@GetMapping("/entities/{id}")
	public ResponseEntity<EntityDto> getEntityById(@PathVariable int id);
	
	
	@Component
	public class DefnitionServiceFallback implements IDefnitionService {
		
		@Override
		public ResponseEntity<EntityDto> getEntityById(int id) {
			return new ResponseEntity<>(null,HttpStatus.OK);
		}

	}
}
