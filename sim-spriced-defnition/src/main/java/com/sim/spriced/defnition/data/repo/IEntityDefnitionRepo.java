package com.sim.spriced.defnition.data.repo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.sim.spriced.framework.models.EntityDefnition;
import org.json.JSONArray;


public interface IEntityDefnitionRepo {
	public EntityDefnition add(EntityDefnition defnition);
	public EntityDefnition change(EntityDefnition defnition);
	public int remove(EntityDefnition defnition);
	
	public EntityDefnition get(int id);
	public EntityDefnition getByName(String name,int groupId);
	
	public EntityDefnition get(int id,boolean loadDisabled);
	public EntityDefnition getByName(String name,int groupId,boolean loadDisabled);
	
	public List<EntityDefnition> getAll(boolean loadDisabled);
	public List<EntityDefnition> getAll(int groupId,boolean loadDisabled);
	
	public Page<EntityDefnition> getAll(boolean loadDisabled,Pageable pagable);
	public Page<EntityDefnition> getAll(int groupId,boolean loadDisabled,Pageable pagable);
	
	public List<EntityDefnition> fetchRelatedEntities(int entityId);
    
//	public List<EntityDefnition> fetchAll(boolean loadDisabled);
//	public Page<EntityDefnition> fetchAll(boolean loadDisabled,Pageable pagable);
//	public List<EntityDefnition> fetchAll(String group,boolean loadDisabled);
//	public Page<EntityDefnition> fetchAll(String group,boolean loadDisabled,Pageable pagable);
//	public EntityDefnition fetchByName(String name,String group,boolean loadDisabled);
//	public EntityDefnition fetchByName(String name,String group);
//	public List<EntityDefnition> disableEntity(String name);
}
