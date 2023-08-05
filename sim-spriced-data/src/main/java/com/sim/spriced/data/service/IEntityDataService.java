package com.sim.spriced.data.service;

import java.util.List;
import java.util.Map;


import org.json.JSONObject;

import com.sim.spriced.data.model.EntityData;
import com.sim.spriced.data.model.EntityDataResult;
import com.sim.spriced.framework.data.filters.Criteria;
import com.sim.spriced.framework.rule.IRule;
import org.json.JSONArray;
import org.springframework.data.domain.Page;

public interface IEntityDataService {
	public EntityDataResult upsert(EntityData data);
	public EntityDataResult upsertBulk(EntityData data);
	
	public EntityDataResult upsert(EntityData data,List<IRule<JSONObject>> rules);
	public EntityDataResult upsertBulk(EntityData data,List<IRule<JSONObject>> rules);
	
	public EntityDataResult deleteBulk(EntityData data);
	public JSONArray fetchAll(EntityData data,Criteria criteria);
	public String fetchAllAsJsonString(EntityData data,Criteria criteria);
	public List<Map<String,Object>> fetchAllAsMap(EntityData data,Criteria criteria); 
	public Page fetchAllAsMapPage(EntityData data,Criteria criteria); 
	public JSONObject fetchOne(EntityData data,Criteria criteria);
}

