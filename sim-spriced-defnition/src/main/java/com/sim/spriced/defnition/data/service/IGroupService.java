package com.sim.spriced.defnition.data.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.sim.spriced.framework.models.Group;

public interface IGroupService {
	Group create(Group group);
	int deleteByName(String name);
	int delete(int id);
	Group changeName(String currentName,String newName);
	Group changeName(int id,String newName);
	Group disableGroupByName(String name);
	Group enableGroupByName(String name);
	Group disableGroup(int id);
	Group enableGroup(int id);
	Group fetchByName(String name,boolean loadDisabled);
	Group fetch(int id,boolean loadDisabled);
	List<Group> fetchAll(String name,boolean loadDisabled);
	Page<Group> fetchAll(String name,boolean loadDisabled,Pageable pageable);
	List<Group> fetchAll(boolean loadDisabled);
    List<Group> fetchAllByRole(boolean loadDisabled,String role);
	Page<Group> fetchAll(boolean loadDisabled,Pageable pageable);
	
}
