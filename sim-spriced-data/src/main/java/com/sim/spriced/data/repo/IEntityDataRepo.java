package com.sim.spriced.data.repo;

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
	public JSONObject fetchOne(EntityData data);
	
}
