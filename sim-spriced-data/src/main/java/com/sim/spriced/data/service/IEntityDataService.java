package com.sim.spriced.data.service;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.domain.Pageable;

import com.sim.spriced.data.model.EntityData;
import com.sim.spriced.data.model.EntityDataResult;
import com.sim.spriced.framework.rule.IRule;

public interface IEntityDataService {
	public EntityDataResult upsert(EntityData data);
	public EntityDataResult upsertBulk(EntityData data);
	
	public EntityDataResult upsert(EntityData data,List<IRule<JSONObject>> rules);
	public EntityDataResult upsertBulk(EntityData data,List<IRule<JSONObject>> rules);
	
	public EntityDataResult deleteBulk(EntityData data);
	public JSONArray fetchAll(EntityData data);
	public JSONArray fetchAll(EntityData data,Pageable pageable);
	public JSONObject fetchOne(EntityData data);
}

