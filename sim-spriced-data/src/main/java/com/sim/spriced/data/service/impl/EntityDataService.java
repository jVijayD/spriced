package com.sim.spriced.data.service.impl;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.jooq.JSON;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sim.spriced.data.model.EntityData;
import com.sim.spriced.data.model.EntityDataResult;
import com.sim.spriced.data.repo.IEntityDataRepo;
import com.sim.spriced.data.service.IEntityDataRuleService;
import com.sim.spriced.data.service.IEntityDataService;
import com.sim.spriced.framework.constants.ModelConstants;
import com.sim.spriced.framework.data.filters.Criteria;
import com.sim.spriced.framework.exceptions.permission.PermissionException;
import com.sim.spriced.framework.models.Attribute;
import com.sim.spriced.framework.models.AttributeConstants.ConstraintType;
import com.sim.spriced.framework.rule.FactResult;
import com.sim.spriced.framework.rule.IRule;
import com.sim.spriced.framework.rule.Result;

@Service
public class EntityDataService implements IEntityDataService {

	@Autowired
	IEntityDataRepo dataRepo;

	@Autowired
	IEntityDataRuleService dataRuleService;

	@Transactional
	@Override
	public EntityDataResult upsertBulk(EntityData data) {
		var filteredAttributes = this.getAttributesWithAccess(data);
		data.setAttributes(filteredAttributes);
		return EntityDataResult.builder().rowsChanged(this.dataRepo.upsertBulk(data)).build();
	}

	@Override
	public EntityDataResult deleteBulk(EntityData data) {
                var filteredAttributes = this.getAttributesWithAccess(data);
                if(filteredAttributes.size() <= 1){
                    throw new PermissionException(data.getEntityName());
                }
		return EntityDataResult.builder().rowsChanged(this.dataRepo.deleteBulk(data)).build();
	}

	@Override
	public JSONArray fetchAll(EntityData data, Criteria criteria) {
		return this.dataRepo.fetchAll(data, criteria);
	}

	@Override
	public JSONObject fetchOne(EntityData data, Criteria criteria) {
		return this.dataRepo.fetchOne(data, criteria);
	}

	@Override
	public EntityDataResult upsert(EntityData data) {
		var filteredAttributes = this.getAttributesWithAccess(data);
		data.setAttributes(filteredAttributes);
		List<Map<String, Object>> jsonObj = Arrays.asList(this.dataRepo.upsert(data));
		return EntityDataResult.builder().rowsChanged(new int[] { 1 }).result(jsonObj).build();
	}

	private List<Attribute> getAttributesWithAccess(EntityData data) {
		return data.getAttributes().stream().filter(a -> a.getPermission() == ModelConstants.ModelPermission.UPDATE
				|| a.getConstraintType() == ConstraintType.PRIMARY_KEY).collect(Collectors.toList());

	}

	@Override
	public EntityDataResult upsert(EntityData data, List<IRule<JSONObject>> rules) {
		return this.executeUpsert(data, rules, this::upsert);
	}

	@Transactional
	@Override
	public EntityDataResult upsertBulk(EntityData data, List<IRule<JSONObject>> rules) {
		return this.executeUpsert(data, rules, this::upsertBulk);
	}

	private EntityDataResult executeUpsert(EntityData data, List<IRule<JSONObject>> rules,
			Function<EntityData, EntityDataResult> upsertLogic) {

		if (rules != null && !rules.isEmpty()) {
			List<FactResult<JSONObject>> ruleResults = this.dataRuleService.executeRules(rules, data.getValues());
			List<JSONObject> dataAfterRuleExecution = this.setRuleExecutionErrorStatus(ruleResults);
			data.setValues(dataAfterRuleExecution);
			EntityDataResult result =null;
			if(data.getValues().isEmpty()) {
				List<Map<String, Object>> ruleResult=new ArrayList<>();
				Map<String,Object> map=new HashMap<>();
				ruleResult.add(map);
				map.put("is_valid",false);
				result = EntityDataResult.builder().rowsChanged(new int[] { 0 }).result(ruleResult).build();
			}
			else {
				result = upsertLogic.apply(data);
			}
			result.setRuleValidations(ruleResults);
			return result;
		} else {
			return upsertLogic.apply(data);
		}

	}

//	private List<JSONObject> setRuleExecutionErrorStatus(List<FactResult<JSONObject>> ruleResults) {
//		return ruleResults.parallelStream().map(result -> {
//			if (!result.isSucces()) {
//				List<Result> item = result.getRuleResults();
//				ObjectMapper objectMapper = new ObjectMapper();
//				try {
//					JSON jsonVal = JSON.json(objectMapper.writeValueAsString(item));
//					result.getOutput().put(ModelConstants.ERROR, jsonVal);
//				} catch (JsonProcessingException e) {
//					// No action if not able to serialize
//				}
//				result.getOutput().put(ModelConstants.IS_VALID, false);
//			} else {
//				result.getOutput().put(ModelConstants.IS_VALID, true);
//			}
//			return result.getOutput();
//		}).toList();
//	}
	
	private List<JSONObject> setRuleExecutionErrorStatus(List<FactResult<JSONObject>> ruleResults) {
		return ruleResults.parallelStream().filter(result->result.isSucces()).map(result -> {
			result.getOutput().put(ModelConstants.IS_VALID, true);
			return result.getOutput();
		}).toList();
	}

	@Override
	public String fetchAllAsJsonString(EntityData data, Criteria criteria) {
		return this.dataRepo.fetchAllAsJsonString(data, criteria);
	}

	@Override
	public List<Map<String, Object>> fetchAllAsMap(EntityData data, Criteria criteria) {
		return this.dataRepo.fetchAllAsMap(data, criteria);
	}

	@Override
	public Page fetchAllAsMapPage(EntityData data, Criteria criteria) {
		return this.dataRepo.fetchAllAsMapPage(data, criteria);
	}

}
