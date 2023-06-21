package com.sim.spriced.data.repo;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.domain.Pageable;

import com.sim.spriced.data.model.EntityData;

public interface IEntityDataRepo {
	public int[] upsert(EntityData data);
	public int[] delete(EntityData data);
	public JSONArray fetchAll(EntityData data);
	public JSONArray fetchAll(EntityData data,Pageable pageable);
	public JSONObject fetchOne(EntityData data);
	
}
