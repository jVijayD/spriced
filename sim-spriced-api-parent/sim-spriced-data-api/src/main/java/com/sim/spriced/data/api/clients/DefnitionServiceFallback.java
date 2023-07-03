package com.sim.spriced.data.api.clients;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.sim.spriced.data.api.dto.EntityDto;
import com.sim.spriced.data.api.dto.RuleDto;

//TO DO: Need to correct the Fallback issue
@Component
public class DefnitionServiceFallback implements IDefnitionService {
	
	@Override
	public ResponseEntity<EntityDto> getEntityById(int id) {
		return new ResponseEntity<>(null,HttpStatus.OK);
	}

	@Override
	public ResponseEntity<List<RuleDto>> getRuleByEntityId(int id) {
		return null;
	}

}
