package com.sim.spriced.defnition.data.service.impl;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.sim.spriced.defnition.data.service.BaseService;
import com.sim.spriced.defnition.data.service.IGroupService;
import com.sim.spriced.framework.models.Group;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class GroupService extends BaseService implements IGroupService  {

	
	@Override
	public Group create(Group group) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Group edit(Group group) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int delete(Group group) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public Group fetchByName(String name, boolean loadDisabled) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Group> fetchAll(String name, boolean loadDisabled) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Group> fetchAll(String name, boolean loadDisabled, Pageable pageable) {
		// TODO Auto-generated method stub
		return null;
	}

}
