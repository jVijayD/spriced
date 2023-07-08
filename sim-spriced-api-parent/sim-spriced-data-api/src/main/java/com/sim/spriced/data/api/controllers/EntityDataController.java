package com.sim.spriced.data.api.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import javax.validation.Valid;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sim.spriced.data.api.clients.IDefnitionService;
import com.sim.spriced.data.api.dto.EntityDataDto;
import com.sim.spriced.data.api.dto.EntityDataResultDto;
import com.sim.spriced.data.api.dto.EntityDto;
import com.sim.spriced.data.api.dto.RuleDto;
import com.sim.spriced.data.api.dto.mapper.RuleDtoMapper;
import com.sim.spriced.data.model.EntityData;
import com.sim.spriced.data.model.EntityDataResult;
import com.sim.spriced.data.service.IEntityDataRuleService;
import com.sim.spriced.data.service.IEntityDataService;
import com.sim.spriced.framework.api.exception.ResourceNotFoundException;
import com.sim.spriced.framework.models.Attribute;
import com.sim.spriced.framework.models.Rule;
import com.sim.spriced.framework.rule.IRule;

import io.micrometer.core.annotation.Timed;

@RestController()
@RequestMapping("/entity/{entityId}/data")
@CrossOrigin(origins = "*")
public class EntityDataController {

	private static final String MESSAGE = "Entity with id -[%d] not present.";

	@Autowired
	IEntityDataService dataService;

	@Autowired
	IDefnitionService defnitionService;

	@Autowired
	RuleDtoMapper ruleDtoMapper;

	@Autowired
	IEntityDataRuleService dataRuleService;

//	@Timed(value = "data.getAll.time", description = "Time taken to return all data")
//	@GetMapping("")
//	public ResponseEntity<JSONArray> get(@PathVariable int entityId,@RequestParam(required = false) Integer pageNo,@RequestParam(required = false) Integer pageSize,@RequestParam(required = false) String sortBy,@RequestParam(required = false) String sortDir)
//			throws ParseException, InterruptedException, ExecutionException {
//		EntityDto entityDto = this.getEntity(entityId).get();
//		if (entityDto != null) {
//			EntityData data = new EntityData();
//			data.setEntityName(entityDto.getName());
//			data.setAttributes(entityDto.getAttributes());
//			
//			if(pageSize==null || pageSize==0) {
//				var result = this.dataService.fetchAll(data);
//				return new ResponseEntity<>(this.convertToSimpleJSONArray(result), HttpStatus.OK);
//			}
//			else {
//				Pageable pageable = this.createPageable(pageNo, pageSize, sortBy, sortDir);
//				var result = this.dataService.fetchAll(data,pageable);
//				return new ResponseEntity<>(this.convertToSimpleJSONArray(result), HttpStatus.OK);
//			}	
//			
//		} else {
//			throw new ResourceNotFoundException(String.format(MESSAGE, entityId));
//		}
//	}

	@Timed(value = "data.getAll.time", description = "Time taken to return all data")
	@GetMapping("")
	public ResponseEntity<List<Map<String,Object>>> get(@PathVariable int entityId,@RequestParam(required = false) Integer pageNo,@RequestParam(required = false) Integer pageSize,@RequestParam(required = false) String sortBy,@RequestParam(required = false) String sortDir)
			throws ParseException, InterruptedException, ExecutionException {
		EntityDto entityDto = this.getEntity(entityId).get();
		if (entityDto != null) {
			EntityData data = new EntityData();
			data.setEntityName(entityDto.getName());
			data.setAttributes(entityDto.getAttributes());
			
			if(pageSize==null || pageSize==0) {
				var result = this.dataService.fetchAllAsMap(data);
				return new ResponseEntity<>(result, HttpStatus.OK);
			}
			else {
				Pageable pageable = this.createPageable(pageNo, pageSize, sortBy, sortDir);
				var result = this.dataService.fetchAllAsMap(data,pageable);
				return new ResponseEntity<>(result, HttpStatus.OK);
			}	
			
		} else {
			throw new ResourceNotFoundException(String.format(MESSAGE, entityId));
		}
	}
	
	@Timed(value = "data.getAll.time", description = "Time taken to return all data")
	@GetMapping("/json/items")
	public ResponseEntity<String> getJsonString(@PathVariable int entityId,@RequestParam(required = false) Integer pageNo,@RequestParam(required = false) Integer pageSize,@RequestParam(required = false) String sortBy,@RequestParam(required = false) String sortDir)
			throws InterruptedException, ExecutionException {
		EntityDto entityDto = this.getEntity(entityId).get();
		if (entityDto != null) {
			EntityData data = new EntityData();
			data.setEntityName(entityDto.getName());
			data.setAttributes(entityDto.getAttributes());
			
			if(pageSize==null || pageSize==0) {
				var result = this.dataService.fetchAllAsJsonString(data);
				return new ResponseEntity<>(result, HttpStatus.OK);
			}
			else {
				Pageable pageable = this.createPageable(pageNo, pageSize, sortBy, sortDir);
				var result = this.dataService.fetchAllAsJsonString(data,pageable);
				return new ResponseEntity<>(result, HttpStatus.OK);
			}	
			
		} else {
			throw new ResourceNotFoundException(String.format(MESSAGE, entityId));
		}
	}
	
	@Timed(value = "data.get.time", description = "Time taken to return data.")
	@GetMapping("/{id}")
	public ResponseEntity<JSONObject> get(@PathVariable int entityId, @PathVariable String id)
			throws ParseException, InterruptedException, ExecutionException {
		
		
		EntityDto entityDto = this.getEntity(entityId).get();
		if (entityDto != null) {
			EntityData data = new EntityData();
			data.setEntityName(entityDto.getName());
			data.setAttributes(entityDto.getAttributes());

			List<org.json.JSONObject> jsonArray = new ArrayList<>();
			org.json.JSONObject jsonObj = new org.json.JSONObject();
			jsonObj.put("code", Boolean.TRUE.equals(entityDto.getAutoNumberCode()) ? Integer.parseInt(id) : id);
			jsonArray.add(jsonObj);
			data.setValues(jsonArray);
			
			
			var result = this.dataService.fetchOne(data);
			return new ResponseEntity<>(this.convertToSimpleJSONObject(result), HttpStatus.OK);
		} else {
			throw new ResourceNotFoundException(String.format(MESSAGE, entityId));
		}

	}

	@Timed(value = "data.create-bulk.time", description = "Time taken to create-bulk data.")
	@PostMapping("/bulk")
	public ResponseEntity<EntityDataResultDto> createBulk(@PathVariable int entityId,
			@Valid @RequestBody EntityDataDto data) throws InterruptedException, ExecutionException {
		EntityDto entityDto = this.getEntity(entityId).get();
		if (entityDto != null) {
			EntityData convertedData = new EntityData();
			convertedData.setEntityName(entityDto.getName());
			convertedData.setValues(this.convertValuesToJson(data.getData()));
			convertedData.setAttributes(entityDto.getAttributes());
			EntityDataResult result = this.dataService.upsertBulk(convertedData);
			EntityDataResultDto resultDto = new EntityDataResultDto();
			resultDto.setRowsChanged(result.getRowsChanged().length);
			return new ResponseEntity<>(resultDto, HttpStatus.CREATED);
		} else {
			throw new ResourceNotFoundException(String.format(MESSAGE, entityId));
		}
	}

	@Timed(value = "data.create.time", description = "Time taken to create data.")
	@PostMapping()
	public ResponseEntity<EntityDataResultDto> create(@Valid @RequestBody EntityDataDto data,
			@PathVariable int entityId) throws InterruptedException, ExecutionException {

		List<org.json.JSONObject> datas = this.convertValuesToJson(data.getData());
		
		EntityDto entityDto = this.getEntity(entityId).get();
		List<IRule<org.json.JSONObject>> rules = this.getRulesByEntityId(entityId, entityDto.getAttributes()).get();

		
		EntityData convertedData = new EntityData();
		convertedData.setEntityName(entityDto.getName());
		convertedData.setValues(datas);
		convertedData.setAttributes(entityDto.getAttributes());
		EntityDataResult result = this.dataService.upsert(convertedData,rules);

		EntityDataResultDto resultDto = new EntityDataResultDto();
		resultDto.setRowsChanged(result.getRowsChanged().length);
		resultDto.setResult(result.getResult());
		resultDto.setRuleValidations(result.getRuleValidations());

		return new ResponseEntity<>(resultDto, HttpStatus.CREATED);

	}

	@Timed(value = "data.create.time", description = "Time taken to create data")
	@PutMapping()
	public ResponseEntity<EntityDataResultDto> update(@Valid @RequestBody EntityDataDto data,
			@PathVariable int entityId) throws InterruptedException, ExecutionException {

		EntityDto entityDto = this.getEntity(entityId).get();
		
		if (entityDto != null) {
			List<IRule<org.json.JSONObject>> rules = this.getRulesByEntityId(entityId, entityDto.getAttributes()).get();
			
			List<org.json.JSONObject> jsonObjets = this.convertValuesToJson(data.getData());
			jsonObjets.get(0).put("change", true);

			EntityData convertedData = new EntityData();
			convertedData.setEntityName(entityDto.getName());
			convertedData.setValues(jsonObjets);
			convertedData.setAttributes(entityDto.getAttributes());
			EntityDataResult result = this.dataService.upsert(convertedData,rules);

			EntityDataResultDto resultDto = new EntityDataResultDto();
			resultDto.setRowsChanged(result.getRowsChanged().length);
			resultDto.setResult(result.getResult());
			resultDto.setRuleValidations(result.getRuleValidations());

			return new ResponseEntity<>(resultDto, HttpStatus.CREATED);
		} else {
			throw new ResourceNotFoundException(String.format(MESSAGE, entityId));
		}

	}

	@SuppressWarnings("unchecked")
	private List<org.json.JSONObject> convertValuesToJson(List<Object> values) {
		return values.stream().map(item -> new org.json.JSONObject((Map<String, ?>) item)).toList();
	}

	private JSONArray convertToSimpleJSONArray(org.json.JSONArray result) throws ParseException {
		JSONParser parser = new JSONParser();
		return (JSONArray) parser.parse(result.toString());
	}

	private JSONObject convertToSimpleJSONObject(org.json.JSONObject result) throws ParseException {
		JSONParser parser = new JSONParser();
		return (JSONObject) parser.parse(result.toString());
	}

	@Async
	private CompletableFuture<EntityDto> getEntity(int id) {
		EntityDto dto = this.defnitionService.getEntityById(id).getBody();
		return CompletableFuture.completedFuture(dto);
	}

	@Async
	private CompletableFuture<List<IRule<org.json.JSONObject>>> getRulesByEntityId(int id, List<Attribute> attributes) {
		List<RuleDto> ruleDtoList = this.defnitionService.getRuleByEntityId(id).getBody();
		List<IRule<org.json.JSONObject>> ruleEngineRules = this.dataRuleService
				.getRuleEngineRules(this.ruleDtoMapper.toRuleList(ruleDtoList), attributes);
		return CompletableFuture.completedFuture(ruleEngineRules);
	}
	
	private Pageable createPageable(int pageNo,int pageSize, String sortBy, String sortDir) {
		Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
		
		return PageRequest.of(pageNo, pageSize, sort);
	}

}
