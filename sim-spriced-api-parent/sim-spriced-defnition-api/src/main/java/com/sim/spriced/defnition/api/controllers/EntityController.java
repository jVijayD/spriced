package com.sim.spriced.defnition.api.controllers;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sim.spriced.defnition.api.dto.EntityDto;
import com.sim.spriced.defnition.api.dto.mapper.EntityDtoMapper;
import com.sim.spriced.defnition.data.service.IEntityDefnitionService;
import com.sim.spriced.framework.models.EntityDefnition;

import io.micrometer.core.annotation.Timed;

@CrossOrigin(origins = "*")
@RestController()
@RequestMapping("/entities")
public class EntityController {
	
	@Autowired
	IEntityDefnitionService entityDefnitionService;
	
	@Autowired
	EntityDtoMapper mapper;
	
	
	@Timed(value = "entity.create.time", description = "Time taken to create entity.")
	@PostMapping
	public EntityDto create(@Valid @RequestBody EntityDto entity) {
		EntityDefnition defnition= mapper.toEntityDefnition(entity);
		defnition.setIsDisabled(false);
		defnition = this.entityDefnitionService.create(defnition);
		return mapper.toEntityDto(defnition);
	}
	
	@Timed(value = "entity.delete.time", description = "Time taken to delete entity.")
	@DeleteMapping("/{id}")
	public int delete(@PathVariable int id) {
		return this.entityDefnitionService.delete(id);
	}
	
	
}
