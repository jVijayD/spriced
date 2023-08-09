package com.sim.spriced.data.repo.impl;

import java.time.OffsetDateTime;
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
import org.springframework.stereotype.Repository;

import com.sim.spriced.data.model.EntityData;
import com.sim.spriced.data.repo.IEntityDataRepo;
import com.sim.spriced.framework.constants.ModelConstants;
import com.sim.spriced.framework.data.filters.Criteria;
import com.sim.spriced.framework.exceptions.data.UniqueConstraintException;
import com.sim.spriced.framework.models.Attribute;
import com.sim.spriced.framework.models.AttributeConstants.ConstraintType;
import com.sim.spriced.framework.models.AttributeConstants.DataType;
import com.sim.spriced.framework.repo.BaseRepo;

import net.bytebuddy.implementation.bind.annotation.Super;

import org.springframework.data.domain.Page;

@Repository
public class EntityDataRepo extends BaseRepo implements IEntityDataRepo {

	private static final String CHANGE = "change";
	private EnumMap<DataType,Object> nullValueMap = new EnumMap<>(DataType.class);
	
	public EntityDataRepo(){
		this.initializeNullMap();
	}

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
	
	private void initializeNullMap() {
		this.nullValueMap.put(DataType.BOOLEAN, DSL.val((Boolean)null));
		this.nullValueMap.put(DataType.INTEGER, DSL.val((Integer)null));
		this.nullValueMap.put(DataType.DOUBLE, DSL.val((Double)null));
		this.nullValueMap.put(DataType.FLOAT, DSL.val((Double)null));
		this.nullValueMap.put(DataType.DATE, DSL.val((OffsetDateTime )null));
		this.nullValueMap.put(DataType.DATE_TIME, DSL.val((OffsetDateTime)null));
		this.nullValueMap.put(DataType.STRING_VAR, DSL.val((String)null));
		this.nullValueMap.put(DataType.TEXT, DSL.val((String)null));
		this.nullValueMap.put(DataType.LINK, DSL.val((String)null));
		this.nullValueMap.put(DataType.STRING, DSL.val((String)null));
	}
	
	private Object getNullValue(DataType dataType){
		return this.nullValueMap.getOrDefault(dataType, null);
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
		Collection<Field<?>> allFields = new ArrayList<>(fieldValues.keySet());
		allFields.addAll(fieldValuesPrimaryKey.keySet());
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

		attributes.forEach(item -> {
				boolean isPrimaryKey = item.getConstraintType() == ConstraintType.PRIMARY_KEY;
				AttributeConstants.DataType dataType = item.getDataType();
				if (!isPrimaryKey) {
					if(!dataType.equals(AttributeConstants.DataType.AUTO)) {
						 if (dataType.equals(AttributeConstants.DataType.TIME_STAMP_WITH_TIMEZONE)|| dataType.equals(AttributeConstants.DataType.TIME_STAMP)) {
							 fieldValues.put(column(item.getName(),OffsetDateTime.class), jsonObject.has(item.getName())? jsonObject.get(item.getName()):this.getNullValue(dataType));
				            }
						 else {
							 fieldValues.put(column(item.getName()), jsonObject.has(item.getName())? jsonObject.get(item.getName()):this.getNullValue(dataType));
						 }
					}
					
				} else {
					if (Boolean.TRUE.equals(!isChange) && dataType.equals(AttributeConstants.DataType.STRING_VAR)){
						fieldValues.put(column(item.getName()), jsonObject.get(item.getName()));
					} else {
						primaryKeyValues.put(column(item.getName()), jsonObject.has(item.getName())? jsonObject.get(item.getName()):this.getNullValue(dataType));
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
	public JSONArray fetchAll(EntityData data, Criteria searchCriteria) {
		String entityName = data.getEntityName();
                List<Field<Object>> fieldsList = data.getAttributes().stream().map(e->column(e.getName())).toList();
		Result<Record> result = fetchRecordsByCriteria(entityName,searchCriteria,fieldsList).fetch();
               	List<String> columns = result != null ? this.getColumns(data.getAttributes(), result.get(0)) : null;
		return this.toJSONArray(result, columns);
	}

	@Override
	public JSONObject fetchOne(EntityData data,Criteria searchCriteria) {
		String entityName = data.getEntityName();
                List<Field<Object>> fieldsList = data.getAttributes().stream().map(e->column(e.getName())).toList();
		Record result = fetchRecordsByCriteria(entityName,searchCriteria,fieldsList).fetchOne();
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

			jsonObj.put(ModelConstants.UPDATED_BY, this.contextManager.getRequestContext().getUser());
			jsonObj.put(ModelConstants.UPDATED_DATE,this.getCurrentDateTime());
			if(!jsonObj.has(ModelConstants.IS_VALID)) {
				jsonObj.put(ModelConstants.IS_VALID, true);
			}
			
			
			Pair<Map<Field<?>, Object>, Map<Field<?>, Object>> fieldValuesWithPrimaryKey = this
					.getFieldValues(data.getAttributes(), jsonObj, isChange);

			return this.executeUpsertQuery(entityName, fieldValuesWithPrimaryKey.getLeft(),
					fieldValuesWithPrimaryKey.getRight(), isChange);

		} catch (DataIntegrityViolationException ex) {
			throw new UniqueConstraintException(data.getEntityName(), ex);
		}

	}

	@Override
	public List<Map<String, Object>> fetchAllAsMap(EntityData data, Criteria searchCriteria) {
		String entityName = data.getEntityName();
		List<Field<Object>> fieldsList = data.getAttributes().stream().map(e->column(e.getName())).toList();
                Result<Record> result = fetchRecordsByCriteria(entityName,searchCriteria,fieldsList).fetch();
		return result.intoMaps();
	}
	@Override
	public Page fetchAllAsMapPage(EntityData data, Criteria searchCriteria) {
		String entityName = data.getEntityName();
		List<Field<Object>> fieldsList = data.getAttributes().stream().map(e -> column(e.getName())).toList();
		return fetchRecordsByCriteriaPage(entityName, searchCriteria, fieldsList);
	}

	@Override
	public String fetchAllAsJsonString(EntityData data,Criteria searchCriteria) {
		String entityName = data.getEntityName();
		List<Field<Object>> fieldsList = data.getAttributes().stream().map(e->column(e.getName())).toList();
                Result<Record> result = fetchRecordsByCriteria(entityName,searchCriteria,fieldsList).fetch();
		return result.formatJSON();
	}

}
