package com.sim.spriced.data.api.controllers;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sim.spriced.data.api.dto.EntityDataDto;
import com.sim.spriced.data.api.dto.EntityDataResultDto;
import com.sim.spriced.data.api.dto.mapper.EntityDataDtoMapper;
import com.sim.spriced.data.api.dto.mapper.EntityDataResultDtoMapper;
import com.sim.spriced.data.model.EntityData;
import com.sim.spriced.data.model.EntityDataResult;
import com.sim.spriced.data.service.IEntityDataService;

import io.micrometer.core.annotation.Timed;

@RestController()
@RequestMapping("/data/{entity}")
@CrossOrigin(origins = "*")
public class EntityDataController {

	@Autowired
	IEntityDataService dataService;

	@Autowired
	EntityDataDtoMapper dataMapper;

	@Autowired
	EntityDataResultDtoMapper resultMapper;

	@Timed(value = "data.getAll.time", description = "Time taken to return all data")
	@GetMapping("")
	public ResponseEntity<JSONArray> get(@PathVariable String entity) {
		EntityData data = new EntityData();
		data.setEntityName(entity);
		return new ResponseEntity<>(this.dataService.fetchAll(data), HttpStatus.OK);
	}

	@Timed(value = "data.getAll.time", description = "Time taken to return all data")
	@PostMapping("/get")
	public ResponseEntity<JSONArray> getAll(@PathVariable String entity, @Valid @RequestBody EntityData data) {
		data.setEntityName(entity);
		return new ResponseEntity<>(this.dataService.fetchAll(data), HttpStatus.OK);
	}

	@Timed(value = "data.get.time", description = "Time taken to return data")
	@GetMapping("/{id}")
	public ResponseEntity<JSONObject> get(@PathVariable String entity, @PathVariable String id) {
		EntityData data = new EntityData();
		data.setEntityName(entity);
		List<JSONObject> jsonArray = new ArrayList<>();
		JSONObject jsonObj = new JSONObject();
		jsonObj.put("code", id);
		jsonArray.add(jsonObj);
		data.setValues(jsonArray);

		return new ResponseEntity<>(this.dataService.fetchOne(data), HttpStatus.OK);
	}

	@Timed(value = "data.create.time", description = "Time taken to create data")
	@PostMapping
	public ResponseEntity<EntityDataResultDto> create(@RequestBody EntityDataDto data,@PathVariable String entity) {
		EntityData convertedData=this.dataMapper.toEntityData(data);
		convertedData.setEntityName(entity);
		EntityDataResult result = this.dataService.upsert(convertedData);
		return new ResponseEntity<>(resultMapper.toEntityDataResultDto(result), HttpStatus.CREATED);
	}
}
