package com.sim.spriced.defnition.repo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.sim.spriced.framework.models.EntityDefnition;


public interface IEntityDefnitionRepo {
	public List<EntityDefnition> fetchAll(boolean loadDisabled);
	public Page<EntityDefnition> fetchAll(boolean loadDisabled,Pageable pagable);
	public EntityDefnition fetchByName(String name,String group);
}
