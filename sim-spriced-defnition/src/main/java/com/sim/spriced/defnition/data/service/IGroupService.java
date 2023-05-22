package com.sim.spriced.defnition.data.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.sim.spriced.framework.models.Group;

public interface IGroupService {
	Group create(Group group);
	Group edit(Group group);
	int delete(Group group);
	Group fetchByName(String name,boolean loadDisabled);
	List<Group> fetchAll(String name,boolean loadDisabled);
	List<Group> fetchAll(String name,boolean loadDisabled,Pageable pageable);
	
}
