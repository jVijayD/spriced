package com.sim.spriced.defnition.data.repo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.sim.spriced.framework.models.EntityDefnition;


public interface IEntityDefnitionRepo {
	public List<EntityDefnition> fetchAll(boolean loadDisabled);
	public Page<EntityDefnition> fetchAll(boolean loadDisabled,Pageable pagable);
	public List<EntityDefnition> fetchAll(String group,boolean loadDisabled);
	public Page<EntityDefnition> fetchAll(String group,boolean loadDisabled,Pageable pagable);
	public EntityDefnition fetchByName(String name,String group,boolean loadDisabled);
	public EntityDefnition fetchByName(String name,String group);
	public List<EntityDefnition> disableEntity(String name);
}
