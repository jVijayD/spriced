package com.sim.spriced.data.repo.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.lang3.tuple.Pair;
import org.jooq.Condition;
import org.jooq.Field;
import org.jooq.Query;
import org.jooq.Record;
import org.jooq.Result;
import org.jooq.impl.DSL;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.sim.spriced.data.model.EntityData;
import com.sim.spriced.data.repo.IEntityDataRepo;
import com.sim.spriced.framework.models.Attribute;
import com.sim.spriced.framework.models.AttributeConstants.ConstraintType;
import com.sim.spriced.framework.repo.BaseRepo;

@Repository
public class EntityDataRepo extends BaseRepo implements IEntityDataRepo {

	private static final String CHANGE = "change";

	@Override
	public int[] upsert(EntityData data) {

		String entityName = data.getEntityName();
		List<Query> queries = new ArrayList<>();
		data.getValues().forEach(jsonObj -> {
			Pair<Map<Field<?>, Object>, Map<Field<?>, Object>> fieldValuesWithPrimaryKey = this
					.getFieldValues(data.getAttributes(), jsonObj);
			boolean isChange = jsonObj.has(CHANGE) && jsonObj.getBoolean(CHANGE);
			queries.add(this.createUpsertQuery(entityName, fieldValuesWithPrimaryKey.getLeft(),
					fieldValuesWithPrimaryKey.getRight(), isChange));
		});
		return this.batchExqecute(queries);
	}

	@Override
	public int[] delete(EntityData data) {
		String entityName = data.getEntityName();
		List<Query> queries = new ArrayList<>();
		data.getValues().forEach(row -> {
			
			queries.add(this.context.delete(table(entityName)).where(DSL.condition(this.getPrimaryKeyValues(data.getAttributes(), row))));
		});
		return this.batchExqecute(queries);
	}

	private Query createUpsertQuery(String entityName, Map<Field<?>, Object> fieldValues,
			Map<Field<?>, Object> fieldValuesPrimaryKey, boolean isChange) {
		Query query = null;
		if (!isChange) {
			Collection<Field<?>> fields = new ArrayList<>(fieldValues.keySet());
			Collection<Object> values = fieldValues.values();
			query = this.context.insertInto(table(entityName), fields).values(values);
		} else {
			query = this.context.update(table(entityName)).set(fieldValues).where(DSL.condition(fieldValuesPrimaryKey));
		}
		return query;
	}

	private Pair<Map<Field<?>, Object>, Map<Field<?>, Object>> getFieldValues(List<Attribute> attributes,
			JSONObject jsonObject) {
		Map<Field<?>, Object> fieldValues = new HashMap<>();
		Map<Field<?>, Object> primaryKeyValues = new HashMap<>();

		attributes.forEach(item -> {
			boolean isPrimaryKey = item.getConstraintType() == ConstraintType.PRIMARY_KEY;
			if (!isPrimaryKey) {
				fieldValues.put(column(item.getName()), jsonObject.get(item.getName()));
			} else {
				primaryKeyValues.put(column(item.getName()), jsonObject.get(item.getName()));
			}
		});

		return Pair.of(fieldValues, primaryKeyValues);
	}

	private Map<Field<?>, Object> getPrimaryKeyValues(List<Attribute> attributes, JSONObject jsonObject) {
		return attributes.stream().filter(item -> item.getConstraintType() == ConstraintType.PRIMARY_KEY)
				.collect(Collectors.toMap(item -> column(item.getName()), item -> jsonObject.get(item.getName())));
	}

	@Override
	public JSONArray fetchAll(EntityData data) {
		String entityName = data.getEntityName();
		Condition condition =  this.createCondition(data);
		
		Result<Record> result = this.context.selectFrom(table(entityName)).where(condition).fetch();
		
		List<String> columns = new ArrayList<>();
		if(data.getAttributes()!=null) {
			columns = data.getAttributes().stream().map(Attribute::getName).toList();
		}
		
		return this.toJSONArray(result, columns);
	}

	@Override
	public JSONArray fetchAll(EntityData data, Pageable pageable) {
		String entityName = data.getEntityName();
		Condition condition =  this.createCondition(data);
		
		Result<Record> result = this.context.selectFrom(table(entityName)).where(condition).orderBy(this.getOrderBy(pageable.getSort()))
				.limit(pageable.getPageSize()).offset(pageable.getOffset()).fetch();
		
		List<String> columns = result!=null?this.getColumns(data.getAttributes(), result.get(0)):null;
		
		return this.toJSONArray(result, columns);
	}

	@Override
	public JSONObject fetchOne(EntityData data) {
		String entityName = data.getEntityName();
		Condition condition =  this.createCondition(data);
		Record result = this.context.selectFrom(table(entityName)).where(condition).fetchOne();
		List<String> columns = data.getAttributes().stream().map(Attribute::getName).toList();
		return this.toJsonObject(result, columns);
	}
	
	private List<String> getColumns(List<Attribute> attributes,Record rec) {
		List<String> columns = new ArrayList<>();
		if(attributes!=null) {
			columns = attributes.stream().map(Attribute::getName).toList();
		}
		else {
			columns = this.extractColumnNames(rec);
		}
		return columns;
	}
	
	private List<String> extractColumnNames(Record rec) {
		List<String> cols = new ArrayList<>();
		JSONObject jsonObj = new JSONObject(rec.formatJSON()); 
		JSONArray jsonArray = jsonObj.getJSONArray("fields");
		Iterator<Object> iter = jsonArray.iterator();
		while(iter.hasNext()) {
			JSONObject obj = (JSONObject)iter.next();
			cols.add(obj.getString("name"));
		}
		return cols;
	}
	
	private Condition createCondition(EntityData data) {

		JSONObject jsobObject =data.getValues()!=null?(JSONObject)data.getValues().get(0):null;
		Map<Field<?>, Object> conditionsMap = new HashMap<>();
		if(jsobObject!=null) {
			data.getAttributes().stream().forEach(item->{
				Object value = jsobObject.get(item.getName());
				if(value!=null) {
					conditionsMap.put(column(item.getName()),value );
				}
			});
		}
		
		return conditionsMap.size()==0?DSL.noCondition():DSL.condition(conditionsMap);
	}

}
