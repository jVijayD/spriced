package com.sim.spriced.defnition.data.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.sim.spriced.defnition.data.repo.impl.GroupRepo;
import com.sim.spriced.defnition.data.service.IGroupService;
import com.sim.spriced.framework.models.Group;

@Service
public class GroupService  implements IGroupService  {

	@Autowired
	private GroupRepo grpRepo;
	
	@Override
	public Group create(Group group) {
		return this.grpRepo.create(group);
	}

	@Override
	public int delete(String name) {
		Group grp = new Group();
		grp.setName(name);
		return this.grpRepo.delete(grp);
	}

	@Override
	public Group disableGroup(String name) {
		Group grp = new Group();
		grp.setName(name);
		grp.setIsDisabled(true);
		return this.grpRepo.update(grp);
	}

	@Override
	public Group enableGroup(String name) {
		Group grp = new Group();
		grp.setName(name);
		grp.setIsDisabled(false);
		return this.grpRepo.update(grp);
	}

	@Override
	public Group fetchByName(String name, boolean loadDisabled) {
		Group grp = new Group();
		grp.setName(name);
		grp.setIsDisabled(loadDisabled);
		return this.grpRepo.fetchOne(grp);
	}

	@Override
	public List<Group> fetchAll(String name, boolean loadDisabled) {
		return this.grpRepo.fetchAll(loadDisabled);
	}

	@Override
	public Page<Group> fetchAll(String name, boolean loadDisabled, Pageable pageable) {
		Group grp = new Group();
		grp.setName(name);
		grp.setIsDisabled(loadDisabled);
		return this.grpRepo.fetchAll(loadDisabled, pageable);
	}


}
