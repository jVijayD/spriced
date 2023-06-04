package com.sim.spriced.defnition.data.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.sim.spriced.defnition.data.repo.impl.GroupRepo;
import com.sim.spriced.defnition.data.service.BaseService;
import com.sim.spriced.defnition.data.service.IGroupService;
import com.sim.spriced.framework.models.Group;

@Service
public class GroupService extends BaseService implements IGroupService {

	@Autowired
	private GroupRepo grpRepo;

	@Override
	public Group create(Group group) {
		group.validate();
		return this.grpRepo.create(group);
	}

	@Override
	public int deleteByName(String name) {
		Group grp = new Group();
		grp.setName(name);
		return this.grpRepo.delete(grp);
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
		return this.grpRepo.fetchAll(grp, Group.class, pageable);
	}

	@Override
	public int delete(int id) {
		Group grp = new Group();
		grp.setId(id);
		return this.grpRepo.delete(grp);
	}

	@Override
	public Group changeName(int id, String newName) {
		Group grp = new Group();
		grp.setId(id);
		grp.setName(newName);
		return this.grpRepo.update(grp);
	}

	@Override
	public Group disableGroup(int id) {
		Group grp = new Group();
		grp.setId(id);
		grp.setIsDisabled(true);
		return this.grpRepo.update(grp);
	}

	@Override
	public Group enableGroup(int id) {
		Group grp = new Group();
		grp.setId(id);
		grp.setIsDisabled(false);
		return this.grpRepo.update(grp);
	}

	@Override
	public Group fetch(int id, boolean loadDisabled) {
		Group grp = new Group();
		grp.setId(id);
		grp.setIsDisabled(loadDisabled);
		return this.grpRepo.fetchOne(grp);
	}

	@Override
	public List<Group> fetchAll(boolean loadDisabled) {
		return this.grpRepo.fetchAll(loadDisabled);
	}

	@Override
	public Page<Group> fetchAll(boolean loadDisabled, Pageable pageable) {
		return this.grpRepo.fetchAll(loadDisabled, pageable);
	}

	@Override
	public Group changeName(String currentName, String newName) {
		return this.grpRepo.changeName(currentName, newName);
	}

	@Override
	public Group disableGroupByName(String name) {
		return this.grpRepo.disableGroupByName(name);
	}

	@Override
	public Group enableGroupByName(String name) {
		return this.grpRepo.enableGroupByName(name);
	}

}
