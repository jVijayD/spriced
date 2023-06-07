package com.sim.spriced.defnition.data.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.sim.spriced.framework.models.EntityDefnition;



public interface IEntityDefnitionService {
	
	EntityDefnition create(EntityDefnition entity);
	EntityDefnition update(EntityDefnition entity);
	int delete(String name,int groupId);
	int delete(EntityDefnition entity);
	
	EntityDefnition disableEntity(String name,int groupId);
	EntityDefnition enableEntity(String name,int groupId);
	
	EntityDefnition fetchByName(String name,int groupId);
	
	List<EntityDefnition> fetchAll(int groupId,boolean loadDisabled);
	List<EntityDefnition> fetchAll(int groupId);
	Page<EntityDefnition> fetchAll(int groupId,boolean loadDisabled,Pageable pageable);
	Page<EntityDefnition> fetchAll(int groupId,Pageable pageable);
}
