package com.sim.spriced.defnition.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sim.spriced.defnition.api.dto.EntityDto;
import com.sim.spriced.defnition.api.dto.mapper.EntityDtoMapper;
import com.sim.spriced.defnition.data.service.IEntityDefnitionService;
import com.sim.spriced.framework.models.EntityDefnition;

@RestController()
@RequestMapping("/entities")
public class EntityController {
	
	@Autowired
	IEntityDefnitionService entityDefnitionService;
	
	@Autowired
	EntityDtoMapper mapper;
	
	@PostMapping
	public EntityDto create(EntityDto entity) {
		EntityDefnition defnition= mapper.toEntityDefnition(entity);
		defnition.setIsDisabled(true);
		this.entityDefnitionService.create(defnition);
		return mapper.toEntityDto(defnition);
	}
}
