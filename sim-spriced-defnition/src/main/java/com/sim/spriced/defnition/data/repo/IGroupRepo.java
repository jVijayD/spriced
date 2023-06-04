package com.sim.spriced.defnition.data.repo;

import java.util.List;

import com.sim.spriced.framework.models.Group;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IGroupRepo {
	public List<Group> fetchAll(boolean loadDisabled);
	public Page<Group> fetchAll(boolean loadDisabled,Pageable pagable);
	public Group fetchByName(String name);

	public Group changeName(String currentName, String newName);
	public Group disableGroupByName(String name);
	public Group enableGroupByName(String name);

}
