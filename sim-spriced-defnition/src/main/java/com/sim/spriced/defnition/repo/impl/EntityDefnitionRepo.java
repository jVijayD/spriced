package com.sim.spriced.defnition.repo.impl;

import java.util.List;

import org.jooq.impl.DSL;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.sim.spriced.defnition.repo.IEntityDefnitionRepo;
import com.sim.spriced.framework.models.EntityDefnition;
import com.sim.spriced.framework.repo.BaseRepo;

@Repository
public class EntityDefnitionRepo extends BaseRepo implements IEntityDefnitionRepo {

	private static final String TABLE="entity";
	
	private static final String NAME="name";
	private static final String GROUP="group";
	private static final String VERSION="version";

	
	@Override
	public EntityDefnition fetchByName(String name, String group) {
		// TODO Auto-generated method stub
		var subSelect = DSL.select(columnMax(VERSION)).from(TABLE);
		return context.selectFrom(TABLE).where(column(NAME).eq(name).and(column(GROUP).eq(group).and(column(VERSION).eq(subSelect)))).fetchOne().into(EntityDefnition.class);
	}

	@Override
	public List<EntityDefnition> fetchAll(boolean loadDisabled) {
		// TODO Auto-generated method stub
		EntityDefnition entity = new EntityDefnition();
		entity.setIsDisabled(true);
		return this.fetchMultiple(entity, EntityDefnition.class);
	}

	@Override
	public Page<EntityDefnition> fetchAll(boolean loadDisabled, Pageable pagable) {
		// TODO Auto-generated method stub
		return null;
	}

}
