package com.sim.spriced.data.service.impl;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import javax.transaction.Transactional;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.sim.spriced.data.model.EntityData;
import com.sim.spriced.data.model.EntityDataResult;
import com.sim.spriced.data.repo.IEntityDataRepo;
import com.sim.spriced.data.service.IEntityDataRuleService;
import com.sim.spriced.data.service.IEntityDataService;
import com.sim.spriced.framework.rule.FactResult;
import com.sim.spriced.framework.rule.IRule;


@Service
public class EntityDataService implements IEntityDataService {

	@Autowired
	IEntityDataRepo dataRepo;
	
	@Autowired
	IEntityDataRuleService dataRuleService;

	@Transactional
	@Override
	public EntityDataResult upsertBulk(EntityData data) {
		return EntityDataResult.builder().rowsChanged(this.dataRepo.upsertBulk(data)).build();
	}

	@Override
	public EntityDataResult deleteBulk(EntityData data) {
		return EntityDataResult.builder().rowsChanged(this.dataRepo.deleteBulk(data)).build();
	}

	@Override
	public JSONArray fetchAll(EntityData data) {
		return this.dataRepo.fetchAll(data);
	}

	@Override
	public JSONArray fetchAll(EntityData data, Pageable pageable) {
		return this.dataRepo.fetchAll(data, pageable);
	}

	@Override
	public JSONObject fetchOne(EntityData data) {
		return this.dataRepo.fetchOne(data);
	}

	@Override
	public EntityDataResult upsert(EntityData data) {
		List<Map<String,Object>> jsonObj = Arrays.asList(this.dataRepo.upsert(data)) ;
		return EntityDataResult.builder().rowsChanged(new int[] { 1 }).result(jsonObj).build();
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
	
	
	private EntityDataResult executeUpsert(EntityData data, List<IRule<JSONObject>> rules,Function<EntityData, EntityDataResult> upsertLogic) {
		List<FactResult<JSONObject>> ruleResults = this.dataRuleService.executeRules(rules, data.getValues());
		List<JSONObject> succesfullFacts = ruleResults.stream().filter(FactResult::isSucces).map(FactResult::getOutput).toList();
		data.setValues(succesfullFacts);
		EntityDataResult result = upsertLogic.apply(data);
		result.setRuleValidations(ruleResults);
		return result;
	}

}
