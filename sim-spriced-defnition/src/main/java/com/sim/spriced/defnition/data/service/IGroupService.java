package com.sim.spriced.defnition.data.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.sim.spriced.framework.models.Group;

public interface IGroupService {
	Group create(Group group);
	int delete(String name);
	Group disableGroup(String name);
	Group enableGroup(String name);
	Group fetchByName(String name,boolean loadDisabled);
	List<Group> fetchAll(String name,boolean loadDisabled);
	Page<Group> fetchAll(String name,boolean loadDisabled,Pageable pageable);
	
}
