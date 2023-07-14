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
	public JSONArray fetchAll(EntityData data,String filters);
	public JSONArray fetchAll(EntityData data,Pageable pageable,String filters);
	public List<Map<String,Object>> fetchAllAsMap(EntityData data,String filters);
	public List<Map<String,Object>> fetchAllAsMap(EntityData data,Pageable pageable,String filters);
	public String fetchAllAsJsonString(EntityData data,String filters);
	public String fetchAllAsJsonString(EntityData data,Pageable pageable,String filters);
	public JSONObject fetchOne(EntityData data,String filters);
        
}
