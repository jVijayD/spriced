package com.sim.spriced.defnition.data.repo.impl;

import java.util.ArrayList;
import java.util.List;

import org.jooq.JSON;
import org.jooq.Record;
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

	private static final String TABLE = "entity";

	@Override
	public EntityDefnition add(EntityDefnition defnition) {
		return this.create(defnition, rec -> {
			EntityDefnition converted = rec.into(defnition);
			converted.getAttributes().addAll(this.getAttributeFromJson(rec));
			return converted;
		});
	}

	@Override
	public int remove(EntityDefnition defnition) {
		return super.delete(defnition);
	}

	@Override
	public EntityDefnition change(EntityDefnition defnition) {
		return super.update(defnition, rec -> {
			EntityDefnition converted = rec.into(defnition);
			converted.getAttributes().addAll(this.getAttributeFromJson(rec));
			return converted;
		});
	}

	private List<Attribute> getAttributeFromJson(Record recordEntity) {
		var attributesJson =JSON.json(recordEntity.get(ModelConstants.ATTRIBUTES).toString());
		ObjectMapper mapper = new ObjectMapper();
		List<Attribute> attributes = new ArrayList<>();
		try {
			attributes = mapper.readerForListOf(Attribute.class).readValue(attributesJson.toString());
		} catch (JsonProcessingException e) {
			throw new InvalidTypeConversionException(TABLE, ModelConstants.ATTRIBUTES);
		}
		return attributes;
	}

	@Override
	public EntityDefnition get(int id) {
		return this.get(id, false);
	}

	@Override
	public EntityDefnition getByName(String name, int groupId) {
		return this.getByName(name, groupId, false);
	}

	@Override
	public EntityDefnition get(int id, boolean loadDisabled) {
		EntityDefnition defnition = new EntityDefnition(id);
		defnition.setIsDisabled(loadDisabled);
		return this.fetchOne(defnition, rec -> {
			EntityDefnition converted = rec.into(defnition);
			converted.getAttributes().addAll(this.getAttributeFromJson(rec));
			return converted;
		});
	}

	@Override
	public EntityDefnition getByName(String name, int groupId, boolean loadDisabled) {
		EntityDefnition defnition = new EntityDefnition(name);
		defnition.setGroupId(groupId);
		defnition.setIsDisabled(loadDisabled);
		return this.fetchOne(defnition, rec -> {
			EntityDefnition converted = rec.into(defnition);
			converted.getAttributes().addAll(this.getAttributeFromJson(rec));
			return converted;
		});
	}

	@Override
	public List<EntityDefnition> getAll(boolean loadDisabled) {
		EntityDefnition defnition = new EntityDefnition();
		defnition.setIsDisabled(loadDisabled);
		return this.fetchMultiple(defnition, rec -> {
			EntityDefnition converted = rec.into(defnition);
			converted.getAttributes().addAll(this.getAttributeFromJson(rec));
			return converted;
		});
	}

	@Override
	public List<EntityDefnition> getAll(int groupId, boolean loadDisabled) {
		EntityDefnition defnition = new EntityDefnition();
		defnition.setGroupId(groupId);
		defnition.setIsDisabled(loadDisabled);
		return this.fetchMultiple(defnition, rec -> {
			EntityDefnition converted = rec.into(defnition);
			converted.getAttributes().addAll(this.getAttributeFromJson(rec));
			return converted;
		});
	}

	@Override
	public Page<EntityDefnition> getAll(boolean loadDisabled, Pageable pagable) {
		EntityDefnition defnition = new EntityDefnition();
		defnition.setIsDisabled(loadDisabled);
		return this.fetchAll(defnition, rec -> {
			EntityDefnition converted = rec.into(defnition);
			converted.getAttributes().addAll(this.getAttributeFromJson(rec));
			return converted;
		}, pagable);
	}

	@Override
	public Page<EntityDefnition> getAll(int groupId, boolean loadDisabled, Pageable pagable) {
		EntityDefnition defnition = new EntityDefnition();
		defnition.setGroupId(groupId);
		defnition.setIsDisabled(loadDisabled);
		return this.fetchAll(defnition, rec -> {
			EntityDefnition converted = rec.into(defnition);
			converted.getAttributes().addAll(this.getAttributeFromJson(rec));
			return converted;
		}, pagable);
	}

}
