package com.sim.spriced.data.repo;

import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.domain.Pageable;

import com.sim.spriced.data.model.EntityData;
import com.sim.spriced.framework.data.filters.Criteria;
import org.springframework.data.domain.Page;

public interface IEntityDataRepo {
	public Map<String,Object> upsert(EntityData data);
	public int[] upsertBulk(EntityData data);
	public int[] deleteBulk(EntityData data);
	public JSONArray fetchAll(EntityData data,Criteria criteria);
	public List<Map<String,Object>> fetchAllAsMap(EntityData data,Criteria criteria);
	public Page fetchAllAsMapPage(EntityData data,Criteria criteria);
	public String fetchAllAsJsonString(EntityData data,Criteria criteria);
	public JSONObject fetchOne(EntityData data,Criteria criteria);
        
}
