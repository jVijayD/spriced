package com.sim.spriced.data.repo;

import com.sim.spriced.data.model.EntityData;

public interface IEntityDataRepo {
	//public void insert(EntityData data);
	//public void update(EntityData data);
	public int upsert(EntityData data);
	public int delete(EntityData data);
	
}
