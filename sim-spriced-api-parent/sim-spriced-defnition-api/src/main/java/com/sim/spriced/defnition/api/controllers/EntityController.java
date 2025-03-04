package com.sim.spriced.defnition.api.controllers;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sim.spriced.defnition.api.dto.EntityDto;
import com.sim.spriced.defnition.api.dto.mapper.EntityDtoMapper;
import com.sim.spriced.defnition.data.service.IEntityDefnitionService;
import com.sim.spriced.framework.models.EntityDefnition;

import io.micrometer.core.annotation.Timed;

@CrossOrigin(origins = "*")
@RestController()
@RequestMapping("")
public class EntityController {

	@Autowired
	IEntityDefnitionService entityDefnitionService;

	@Autowired
	EntityDtoMapper mapper;

	@Timed(value = "entity.create.time", description = "Time taken to create entity.")
	@PostMapping("/entities")
	public EntityDto create(@Valid @RequestBody EntityDto entity) {
		EntityDefnition defnition = mapper.toEntityDefnition(entity);
		defnition.setIsDisabled(false);
		defnition = this.entityDefnitionService.create(defnition);
		return mapper.toEntityDto(defnition);
	}

	@Timed(value = "entity.update.time", description = "Time taken to update entity.")
	@PutMapping("/entities/{id}")
	public ResponseEntity<EntityDto> update(@PathVariable int id, @Valid @RequestBody EntityDto entity) {
		EntityDefnition defnition = mapper.toEntityDefnition(entity);
		defnition.setId(id);
		defnition = this.entityDefnitionService.update(defnition);
		return new ResponseEntity<>(mapper.toEntityDto(defnition), HttpStatus.CREATED);
	}

	@Timed(value = "entity.delete.time", description = "Time taken to delete entity.")
	@DeleteMapping("/entities/{id}")
	public int delete(@PathVariable int id) {
		return this.entityDefnitionService.delete(id);
	}

	@Timed(value = "entity.getAll.time", description = "Time taken to return entities.")
	@GetMapping("/models/{groupId}/entities")
	public ResponseEntity<List<EntityDto>> getAll(@PathVariable int groupId,
			@RequestParam(required = false) String roleName) {
		// TO DO: temporary Sorting
		List<EntityDefnition> entityList;
		entityList = this.entityDefnitionService.fetchByRole(groupId, roleName != null ? roleName.split(",") : null);
		entityList.sort((a, b) -> a.getDisplayName().compareTo(b.getDisplayName()));
		return new ResponseEntity<>(mapper.toEntityDtoList(entityList), HttpStatus.OK);
	}

	@Timed(value = "entity.get.time", description = "Time taken to return entity.")
	@GetMapping("/entities/{id}")
	public ResponseEntity<EntityDto> get(@PathVariable int id) {
		return new ResponseEntity<>(mapper.toEntityDto(this.entityDefnitionService.fetchByRole(id)), HttpStatus.OK);
	}

	@Timed(value = "related entity.get.time", description = "Time taken to return related entities.")
	@GetMapping("/models/{groupId}/entities/{id}/related")
	public ResponseEntity<List<EntityDto>> getrelatedEntity(@PathVariable int id, @PathVariable int groupId) {
		return new ResponseEntity<>(
				mapper.toEntityDtoList(this.entityDefnitionService.fetchRelatedEntities(groupId, id)), HttpStatus.OK);
	}

}
