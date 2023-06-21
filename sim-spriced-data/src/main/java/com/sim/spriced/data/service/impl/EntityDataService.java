package com.sim.spriced.data.service.impl;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.sim.spriced.data.model.EntityData;
import com.sim.spriced.data.model.EntityDataResult;
import com.sim.spriced.data.repo.IEntityDataRepo;
import com.sim.spriced.data.service.IEntityDataService;

@Service
public class EntityDataService implements IEntityDataService {

	@Autowired
	IEntityDataRepo dataRepo;

	@Override
	public EntityDataResult upsert(EntityData data) {
		return EntityDataResult.builder().rowsChanged(this.dataRepo.upsert(data)).build();
	}

	@Override
	public EntityDataResult delete(EntityData data) {
		return EntityDataResult.builder().rowsChanged(this.dataRepo.delete(data)).build();
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

}
