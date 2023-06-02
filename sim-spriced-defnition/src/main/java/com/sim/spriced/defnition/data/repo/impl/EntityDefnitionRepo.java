package com.sim.spriced.defnition.data.repo.impl;

import java.util.ArrayList;
import java.util.List;

import org.jooq.Condition;
import org.jooq.JSON;
import org.jooq.Record;
import org.jooq.impl.DSL;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sim.spriced.defnition.data.repo.IEntityDefnitionRepo;
import com.sim.spriced.framework.constants.ModelConstants;
import com.sim.spriced.framework.exceptions.data.InvalidTypeConversionException;
import com.sim.spriced.framework.models.Attribute;
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
		var recordEntity = context.selectFrom(TABLE).where(column(NAME).eq(name).and(column(GROUP).eq(group).and(column(VERSION).eq(subSelect)))).fetchOne();
		EntityDefnition defnition =  recordEntity.into(EntityDefnition.class);
		defnition.getAttributes().addAll(this.getAttributeFromJson(recordEntity));
		return defnition;
	}

	@Override
	public List<EntityDefnition> fetchAll(boolean loadDisabled) {
		EntityDefnition entity = new EntityDefnition();
		entity.setIsDisabled(true);
		return this.fetchMultiple(entity, rec->{
			EntityDefnition defnition = rec.into(EntityDefnition.class);
			defnition.getAttributes().addAll(this.getAttributeFromJson(rec));
			return defnition;
		});
	}

	@Override
	public Page<EntityDefnition> fetchAll(boolean loadDisabled, Pageable pagable) {
		Condition condition = column(ModelConstants.IS_DISABLED).eq(loadDisabled);
		return super.fetchAll(TABLE, condition, rec->{
			EntityDefnition defnition = rec.into(EntityDefnition.class);
			defnition.getAttributes().addAll(this.getAttributeFromJson(rec));
			return defnition;
		}, pagable);
	}
	
	@Override
	public List<EntityDefnition> disableEntity(String name) {
		return context.update(table(TABLE)).set(column(ModelConstants.IS_DISABLED), true).where(column(ModelConstants.NAME).eq(name)).returning().fetch().into(EntityDefnition.class);
	}

	@Override
	public EntityDefnition fetchByName(String name, String group, boolean loadDisabled) {
		var subSelect = DSL.select(columnMax(VERSION)).from(TABLE);
		var recordEntity =  context.selectFrom(TABLE).where(column(NAME).eq(name).and(column(GROUP).eq(group).and(column(VERSION).eq(subSelect))).and(column(ModelConstants.IS_DISABLED).eq(loadDisabled))).fetchOne();
		EntityDefnition defnition =  recordEntity.into(EntityDefnition.class);
		defnition.getAttributes().addAll(this.getAttributeFromJson(recordEntity));
		return defnition;
	}
	
	
	private List<Attribute> getAttributeFromJson(Record recordEntity) {
		var attributesJson = (JSON)recordEntity.get(ModelConstants.ATTRIBUTES);
		ObjectMapper mapper = new ObjectMapper();
		List<Attribute> attributes=new ArrayList<>();
		try {
			attributes = mapper.readerForListOf(Attribute.class).readValue(attributesJson.toString());
		} catch (JsonProcessingException e) {
			throw new InvalidTypeConversionException(TABLE,ModelConstants.ATTRIBUTES);
		}
		return attributes;
	}

	@Override
	public List<EntityDefnition> fetchAll(String group, boolean loadDisabled) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Page<EntityDefnition> fetchAll(String group, boolean loadDisabled, Pageable pagable) {
		// TODO Auto-generated method stub
		return null;
	}



}
