package com.sim.spriced.defnition.data.repo.impl;

import java.util.List;

import org.jooq.Condition;
import org.jooq.impl.DSL;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.sim.spriced.defnition.data.repo.IEntityDefnitionRepo;
import com.sim.spriced.framework.constants.ModelConstants;
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
		var subSelect = DSL.select(columnMax(VERSION)).from(TABLE);
		return context.selectFrom(TABLE).where(column(NAME).eq(name).and(column(GROUP).eq(group).and(column(VERSION).eq(subSelect)))).fetchOne().into(EntityDefnition.class);
	}

	@Override
	public List<EntityDefnition> fetchAll(boolean loadDisabled) {
		EntityDefnition entity = new EntityDefnition();
		entity.setIsDisabled(true);
		return this.fetchMultiple(entity, EntityDefnition.class);
	}

	@Override
	public Page<EntityDefnition> fetchAll(boolean loadDisabled, Pageable pagable) {
		Condition condition = column(ModelConstants.IS_DISABLED).eq(loadDisabled);
		return super.fetchAll(TABLE, condition, EntityDefnition.class, pagable);
	}

	@Override
	public List<EntityDefnition> disableEntity(String name) {
		return context.update(table(TABLE)).set(column(ModelConstants.IS_DISABLED), true).where(column(ModelConstants.NAME).eq(name)).returning().fetch().into(EntityDefnition.class);
	}

}
