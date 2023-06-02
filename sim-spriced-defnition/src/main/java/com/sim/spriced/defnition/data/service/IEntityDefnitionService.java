package com.sim.spriced.defnition.data.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.sim.spriced.framework.models.EntityDefnition;



public interface IEntityDefnitionService {
	EntityDefnition create(EntityDefnition entity);
	EntityDefnition update(EntityDefnition entity);
	int delete(String name,int version,String grpName);
	EntityDefnition disableEntity(String name,int version,String grpname);
	List<EntityDefnition> disableEntity(String name);
	EntityDefnition enableEntity(String name,int version,String grpname);
	EntityDefnition fetchByName(String name,String group,boolean loadDisabled);
	List<EntityDefnition> fetchAll(String group,boolean loadDisabled);
	Page<EntityDefnition> fetchAll(String group,boolean loadDisabled,Pageable pageable);
}
