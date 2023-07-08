package com.sim.spriced.data.repo;

import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.domain.Pageable;

import com.sim.spriced.data.model.EntityData;

public interface IEntityDataRepo {
	public Map<String,Object> upsert(EntityData data);
	public int[] upsertBulk(EntityData data);
	public int[] deleteBulk(EntityData data);
	public JSONArray fetchAll(EntityData data);
	public JSONArray fetchAll(EntityData data,Pageable pageable);
	public List<Map<String,Object>> fetchAllAsMap(EntityData data);
	public List<Map<String,Object>> fetchAllAsMap(EntityData data,Pageable pageable);
	public String fetchAllAsJsonString(EntityData data);
	public String fetchAllAsJsonString(EntityData data,Pageable pageable);
	public JSONObject fetchOne(EntityData data);
	
}
