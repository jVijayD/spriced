package com.sim.spriced.data.repo.impl;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang3.tuple.Pair;
import org.jooq.Field;
import org.json.JSONObject;

import com.sim.spriced.data.model.EntityData;
import com.sim.spriced.data.repo.IEntityDataRepo;
import com.sim.spriced.framework.models.Attribute;
import com.sim.spriced.framework.models.AttributeConstants.ConstraintType;
import com.sim.spriced.framework.repo.BaseRepo;

public class EntityDataRepo extends BaseRepo implements IEntityDataRepo {
	
	private static final String CHANGE="change";

	@Override
	public int upsert(EntityData data) {
		
		String entityName = data.getEntityName();
		List<Field<?>> fields = new ArrayList<>();
		
		data.getValues().forEach((row)->{
			JSONObject jsonObj =  (JSONObject)row;
			this.createInsertQuery(jsonObj);
			
		});
		return 0;
	}

	@Override
	public int delete(EntityData data) {
		// TODO Auto-generated method stub
		return 0;
	}
	
	private void createInsertQuery(JSONObject jsonObj) {
		boolean isChange = false;
//		
//		if(jsonObj.has(CHANGE)) {
//			isChange = jsonObj.getBoolean(CHANGE);
//			jsonObj.remove(CHANGE);
//		}
//		
//		this.getFieldsAndValues(jsonObj);
//		if(isChange) {
//			
//		}
//		else {
//			
//		}
	}
	
	private List<Field<?>> getFields(List<Attribute> attributes) {
		List<Field<?>> fields = new ArrayList<>();
		
		attributes.forEach(item->{
			boolean isPrimaryKey = item.getConstraintType() == ConstraintType.PRIMARY_KEY;
			if(!isPrimaryKey) {
				fields.add(column(item.getName()));
			}
		});
		
		return fields;
	}
	
	
	private List<Object> getValues() {
		List<Object> values = new ArrayList<>();
		return values;
	}
	
	
	private Pair<List<Field<?>>, List<Object>> getFieldsAndValues(JSONObject jsonObj,List<Attribute> attributes) {
		Iterator<String> keys = jsonObj.keys();
		List<Field<?>> fields = new ArrayList<>();
		List<Object> values = new ArrayList<>();
		while(keys.hasNext()) {
			fields.add(this.column(keys.next()));
			values.add(jsonObj.get(keys.next()));
		}
		return Pair.of(fields, values);
	}

}
