package com.sim.spriced.data.service;

import java.util.List;
import java.util.Map;


import org.json.JSONObject;
import org.springframework.data.domain.Pageable;

import com.sim.spriced.data.model.EntityData;
import com.sim.spriced.data.model.EntityDataResult;
import com.sim.spriced.framework.rule.IRule;
import org.json.JSONArray;

public interface IEntityDataService {
	public EntityDataResult upsert(EntityData data);
	public EntityDataResult upsertBulk(EntityData data);
	
	public EntityDataResult upsert(EntityData data,List<IRule<JSONObject>> rules);
	public EntityDataResult upsertBulk(EntityData data,List<IRule<JSONObject>> rules);
	
	public EntityDataResult deleteBulk(EntityData data);
	public JSONArray fetchAll(EntityData data,String filters);
	public JSONArray fetchAll(EntityData data,Pageable pageable,String filters);
	public String fetchAllAsJsonString(EntityData data,String filters);
	public String fetchAllAsJsonString(EntityData data,Pageable pageable,String filters);
	public List<Map<String,Object>> fetchAllAsMap(EntityData data,String filters);
	public List<Map<String,Object>> fetchAllAsMap(EntityData data,Pageable pageable,String filters);
	public JSONObject fetchOne(EntityData data,String filters);
}

