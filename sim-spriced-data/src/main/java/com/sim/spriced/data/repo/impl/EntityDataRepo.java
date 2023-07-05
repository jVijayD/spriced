package com.sim.spriced.data.repo.impl;

import java.util.*;
import java.util.stream.Collectors;

import com.sim.spriced.framework.models.AttributeConstants;
import org.apache.commons.lang3.tuple.Pair;
import org.jooq.*;
import org.jooq.Record;
import org.jooq.impl.DSL;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.sim.spriced.data.model.EntityData;
import com.sim.spriced.data.repo.IEntityDataRepo;
import com.sim.spriced.framework.constants.ModelConstants;
import com.sim.spriced.framework.exceptions.data.UniqueConstraintException;
import com.sim.spriced.framework.models.Attribute;
import com.sim.spriced.framework.models.AttributeConstants.ConstraintType;
import com.sim.spriced.framework.repo.BaseRepo;

@Repository
public class EntityDataRepo extends BaseRepo implements IEntityDataRepo {

	private static final String CHANGE = "change";

	@Override
	public int[] upsertBulk(EntityData data) {

		int[] rowChanged = new int[0];
		try {
			String entityName = data.getEntityName();
			List<Query> queries = new ArrayList<>();
			data.getValues().forEach(jsonObj -> {

				boolean isChange = jsonObj.has(CHANGE) && jsonObj.getBoolean(CHANGE);

				Pair<Map<Field<?>, Object>, Map<Field<?>, Object>> fieldValuesWithPrimaryKey = this
						.getFieldValues(data.getAttributes(), jsonObj, isChange);

				queries.add(this.createUpsertQuery(entityName, fieldValuesWithPrimaryKey.getLeft(),
						fieldValuesWithPrimaryKey.getRight(), isChange));
			});
			rowChanged = this.batchExqecute(queries);
		} catch (DataIntegrityViolationException ex) {
			throw new UniqueConstraintException(data.getEntityName(), ex);
		}
		return rowChanged;
	}

	@Override
	public int[] deleteBulk(EntityData data) {
		String entityName = data.getEntityName();
		List<Query> queries = new ArrayList<>();
		data.getValues().forEach(row -> {
			queries.add(this.context.delete(table(entityName))
					.where(DSL.condition(this.getPrimaryKeyValues(data.getAttributes(), row))));
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

	private Map<String,Object> executeUpsertQuery(String entityName, Map<Field<?>, Object> fieldValues,
			Map<Field<?>, Object> fieldValuesPrimaryKey, boolean isChange) {
		Field<?> col = column("code");
		Collection<Field<?>> allFields = new ArrayList<>(fieldValues.keySet());
		if (!fieldValues.containsKey(col)){
			allFields.add(col);
		}
		if (!isChange) {
			Collection<Field<?>> fields = new ArrayList<>(fieldValues.keySet());
			Collection<Object> values = fieldValues.values();
			return this.context.insertInto(table(entityName), fields).values(values).returning(allFields).fetchOne().intoMap();
		} else {
			return this.context.update(table(entityName)).set(fieldValues)
					.where(DSL.condition(fieldValuesPrimaryKey)).returning(allFields).fetchOne().intoMap();
		}
	}

	private Pair<Map<Field<?>, Object>, Map<Field<?>, Object>> getFieldValues(List<Attribute> attributes,
			JSONObject jsonObject, Boolean isChange) {
		Map<Field<?>, Object> fieldValues = new HashMap<>();
		Map<Field<?>, Object> primaryKeyValues = new HashMap<>();

		jsonObject.put(ModelConstants.UPDATED_BY, this.contextManager.getRequestContext().getUser());
		jsonObject.put(ModelConstants.UPDATED_DATE, this.timeStamp);

		attributes.forEach(item -> {
			if (jsonObject.has(item.getName())) {
				boolean isPrimaryKey = item.getConstraintType() == ConstraintType.PRIMARY_KEY;
				AttributeConstants.DataType dataType = item.getDataType();
				if (!isPrimaryKey) {
					fieldValues.put(column(item.getName()), jsonObject.get(item.getName()));
				} else {
					if (Boolean.TRUE.equals(!isChange) && dataType.equals(AttributeConstants.DataType.STRING_VAR)){
						fieldValues.put(column(item.getName()), jsonObject.get(item.getName()));
					} else {
						primaryKeyValues.put(column(item.getName()), jsonObject.get(item.getName()));
					}
				}
			}
		});

		return Pair.of(fieldValues, primaryKeyValues);
	}

	private Map<Field<?>, Object> getPrimaryKeyValues(List<Attribute> attributes, JSONObject jsonObject) {
		return attributes.stream().filter(item -> item.getConstraintType() == ConstraintType.PRIMARY_KEY)
				.filter(item -> jsonObject.has(item.getName()))
				.collect(Collectors.toMap(item -> column(item.getName()), item -> jsonObject.get(item.getName())));
	}

	@Override
	public JSONArray fetchAll(EntityData data) {
		String entityName = data.getEntityName();
		Condition condition = this.createCondition(data);

		Result<Record> result = this.context.selectFrom(table(entityName)).where(condition).fetch();

		List<String> columns = this.getColumns(data.getAttributes(), result==null || result.isEmpty()?null:result.get(0));

		return this.toJSONArray(result, columns);
	}

	@Override
	public JSONArray fetchAll(EntityData data, Pageable pageable) {
		String entityName = data.getEntityName();
		Condition condition = this.createCondition(data);

		Result<Record> result = this.context.selectFrom(table(entityName)).where(condition)
				.orderBy(this.getOrderBy(pageable.getSort())).limit(pageable.getPageSize()).offset(pageable.getOffset())
				.fetch();

		List<String> columns = result != null ? this.getColumns(data.getAttributes(), result.get(0)) : null;

		return this.toJSONArray(result, columns);
	}

	@Override
	public JSONObject fetchOne(EntityData data) {
		String entityName = data.getEntityName();
		Condition condition = this.createCondition(data);
		Record result = this.context.selectFrom(table(entityName)).where(condition).fetchOne();
		List<String> columns = this.getColumns(data.getAttributes(), result);
		return this.toJsonObject(result, columns);
	}

	private List<String> getColumns(List<Attribute> attributes, Record rec) {
		List<String> columns = null;
		if (attributes != null) {
			columns = attributes.stream().map(Attribute::getName).toList();
		} else {
			columns = this.extractColumnNames(rec);
		}
		return columns;
	}

	private List<String> extractColumnNames(Record rec) {
		List<String> cols = new ArrayList<>();
		if(rec!=null) {
			for(Field<?> field:rec.fields()) {
				cols.add(field.getName());
			}
		}
		return cols;
	}

	private Condition createCondition(EntityData data) {

		JSONObject jsobObject = data.getValues() != null ? (JSONObject) data.getValues().get(0) : null;
		Map<Field<?>, Object> conditionsMap = new HashMap<>();
		if (jsobObject != null) {
			jsobObject.keySet().forEach(item->conditionsMap.put(column(item), jsobObject.get(item)));
		}

		return conditionsMap.size() == 0 ? DSL.noCondition() : DSL.condition(conditionsMap);
	}

	@Override
	public Map<String,Object> upsert(EntityData data) {

		try {
			String entityName = data.getEntityName();
			JSONObject jsonObj = data.getValues().get(0);

			boolean isChange = jsonObj.has(CHANGE) && jsonObj.getBoolean(CHANGE);

			Pair<Map<Field<?>, Object>, Map<Field<?>, Object>> fieldValuesWithPrimaryKey = this
					.getFieldValues(data.getAttributes(), jsonObj, isChange);

			return this.executeUpsertQuery(entityName, fieldValuesWithPrimaryKey.getLeft(),
					fieldValuesWithPrimaryKey.getRight(), isChange);

		} catch (DataIntegrityViolationException ex) {
			throw new UniqueConstraintException(data.getEntityName(), ex);
		}

	}

}
