package com.sim.spriced.defnition.data.repo.impl;

import java.util.List;

import org.jooq.Condition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.sim.spriced.defnition.data.repo.IGroupRepo;
import com.sim.spriced.framework.constants.ModelConstants;
import com.sim.spriced.framework.models.Group;
import com.sim.spriced.framework.repo.BaseRepo;

@Repository
public class GroupRepo extends BaseRepo implements IGroupRepo {

	private static final String TABLE = "group";


	@Override
	public Group add(Group group) {
		return super.create(group);
	}

	@Override
	public List<Group> fetchAll(boolean loadDisabled) {
		Condition condition = column(ModelConstants.IS_DISABLED).eq(loadDisabled);
		return super.fetchAll(TABLE, condition, Group.class);
	}

	@Override
	public Page<Group> fetchAll(boolean loadDisabled, Pageable pagable) {
		Condition condition = column(ModelConstants.IS_DISABLED).eq(loadDisabled);
		return super.fetchAll(TABLE, condition, Group.class, pagable);
	}

	@Override
	public Group fetchByName(String name) {
		Group grp = new Group();
		grp.setName(name);
		return super.fetchOne(grp);
	}

	@Override
	public Group changeName(String currentName, String newName) {
		Condition condition = column(ModelConstants.NAME).eq(currentName);
		Group grp = new Group();
		grp.setName(newName);
		return this.update(grp, condition);
	}

	@Override
	public Group disableGroupByName(String name) {
		Condition condition = column(ModelConstants.NAME).eq(name);
		Group grp = new Group();
		grp.setIsDisabled(true);
		return this.update(grp, condition);
	}

	@Override
	public Group enableGroupByName(String name) {
		Condition condition = column(ModelConstants.NAME).eq(name);
		Group grp = new Group();
		grp.setIsDisabled(false);
		return this.update(grp, condition);
	}

	@Override
	public int remove(Group group) {
		return super.delete(group);
	}


}
