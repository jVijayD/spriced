package com.sim.spriced.framework.repo;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.persistence.Column;

import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.DataType;
import org.jooq.Field;
import org.jooq.InsertOnDuplicateStep;
import org.jooq.JSON;
import org.jooq.Param;
import org.jooq.Query;
import org.jooq.Record;
import org.jooq.Result;
import org.jooq.SelectConditionStep;
import org.jooq.SelectField;
import org.jooq.SortField;
import org.jooq.Table;
import org.jooq.impl.DSL;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sim.spriced.framework.annotations.ExtraColumnData;
import com.sim.spriced.framework.annotations.IDType;
import com.sim.spriced.framework.constants.ModelConstants;
import com.sim.spriced.framework.context.SPricedContextManager;
import com.sim.spriced.framework.data.filters.Filter;
import com.sim.spriced.framework.data.filters.FilterGenerator;
import com.sim.spriced.framework.exceptions.data.InvalidConditionException;
import com.sim.spriced.framework.exceptions.data.InvalidEntityFieldMappingException;
import com.sim.spriced.framework.exceptions.data.InvalidFieldMappingException;
import com.sim.spriced.framework.exceptions.data.InvalidTypeConversionException;
import com.sim.spriced.framework.exceptions.data.NotFoundException;
import com.sim.spriced.framework.exceptions.data.NullPrimaryKeyException;
import com.sim.spriced.framework.exceptions.data.UniqueConstraintException;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Repository
public abstract class BaseRepo {

	private static final String ID_TEMPLATE = "<ID>";

	@Autowired
	protected DSLContext context;

	@Autowired
	protected SPricedContextManager contextManager;

	protected final Timestamp timeStamp;

	protected BaseRepo() {
		this.timeStamp = new Timestamp(System.currentTimeMillis());
	}

	protected Field<Object> column(String name) {
		return DSL.field(DSL.name(name));
	}

	protected <T> Field<T> column(String name, Class<T> type) {
		return DSL.field(DSL.name(name), type);
	}

	protected <T> Field<T> column(String name, DataType<T> type) {
		return DSL.field(DSL.name(name), type);
	}

	protected <T> Param<T> constant(T value) {
		return DSL.val(value);
	}

	protected <T> Param<T> constant(T value, Class<T> type) {
		return DSL.val(value, type);
	}

	protected Field<Object> columnMax(String name) {
		return DSL.max(DSL.field(DSL.name(name)));
	}

	protected <T> Field<Object> columnIfNull(String name, T value) {
		return DSL.nvl(DSL.field(DSL.name(name)), value);
	}

	protected <T> Field<Object> columnIfNull(Field<Object> col, T value) {
		return DSL.nvl(col, value);
	}

	protected Table<Record> table(String tableName) {
		return DSL.table(DSL.name(tableName));
	}

	protected JSONArray toJSONArray(Result<Record> result, List<String> colNames) {
		var list = result.map(rec -> this.toJsonObject(rec, colNames));
		return new JSONArray(list);
	}
	
	protected JSONObject toJsonObject(Record result,List<String> colNames) {
		JSONObject obj = new JSONObject();
		colNames.forEach(cn -> {
			try {
				obj.put(cn, result.get(cn));
			} catch (JSONException e) {
				throw new InvalidEntityFieldMappingException("JSONObject", cn, e);
			}
		});
		return obj;
	}

	protected int[] batchExqecute(Collection<Query> queries) {
		return context.batch(queries).execute();
	}

	// Dynamic SQL based on Annotations
	protected <T> T create(T entity) {
		TableData tableDetails = this.getTableData(entity);
		tableDetails.setUpdatedByAndUpdatedDate(this.contextManager.getRequestContext().getUser(), this.timeStamp);
		return this.create(entity, tableDetails);
	}

	protected <T> T create(T entity, Function<Record, T> converter) {
		TableData tableDetails = this.getTableData(entity);
		tableDetails.setUpdatedByAndUpdatedDate(this.contextManager.getRequestContext().getUser(), this.timeStamp);
		return this.create(tableDetails, converter);
	}

	private <T> T create(T entity, TableData tableDetails) {
		try {
			this.createQueryForGeneratedID(tableDetails).returning(tableDetails.getFields()).fetchOne().into(entity);
			return entity;
		}
		catch(DataIntegrityViolationException ex) {
			throw new UniqueConstraintException(tableDetails.getTableName(), ex);
		}
		
	}

	private <T> T create(TableData tableDetails, Function<Record, T> converter) {
		try {
			return converter
					.apply(this.createQueryForGeneratedID(tableDetails).returning(tableDetails.getFields()).fetchOne());
		}
		catch(DataIntegrityViolationException ex) {
			throw new UniqueConstraintException(tableDetails.getTableName(), ex);
		}
		
	}

	private InsertOnDuplicateStep<Record> createQueryForGeneratedID(TableData tableDetails) {

		InsertOnDuplicateStep<Record> insertQuery = null;
		SelectField<?>[] selectFields = this.createDynamicSelectFields(tableDetails);
		Condition condition = DSL.noCondition();
		List<Field<?>> fields = tableDetails.getFieldsAfterExclusion();
		List<Object> values = tableDetails.getValuesAfterExclusion();
		switch (tableDetails.getIdType()) {
		case VERSION_SEQ:

			insertQuery = context.insertInto(table(tableDetails.getTableName()), fields)
					.select(DSL.select(selectFields).from(table(tableDetails.getTableName()).where(condition)));
			break;
		case BUSINESS_SEQ:
			// To DO
		case AUTO:
		case NONE:
		default:
			insertQuery = context.insertInto(table(tableDetails.getTableName()), fields).values(values);
			break;
		}

		return insertQuery;
	}

	private SelectField<?>[] createDynamicSelectFields(TableData tableDetails) {

		List<SelectField<?>> slectList = new ArrayList<>();
		tableDetails.getRecordDataList().forEach(recData -> {
			Object value = recData.getValue();
			if (value != null && value.equals(ID_TEMPLATE) && tableDetails.getIdType() != IDType.NONE
					&& tableDetails.getIdType() != IDType.AUTO) {
				if (tableDetails.getIdType() == IDType.VERSION_SEQ) {
					slectList.add(columnIfNull(columnMax(recData.getField().getName()).add(1), 1));
				} else if (tableDetails.getIdType() == IDType.BUSINESS_SEQ) {
					// TO DO: Need to change
					slectList.add(constant(value));
				}
			} else {
				slectList.add(constant(value));
			}
		});
		return slectList.toArray(new SelectField<?>[slectList.size()]);
	}

	public <T> T update(T entity) {
		TableData tableDetails = this.getTableData(entity);
		tableDetails.setUpdatedByAndUpdatedDate(this.contextManager.getRequestContext().getUser(), this.timeStamp);
		return this.update(entity, tableDetails, null);
	}

	public <T> T update(T entity, Function<Record, T> converter) {
		TableData tableDetails = this.getTableData(entity);
		tableDetails.setUpdatedByAndUpdatedDate(this.contextManager.getRequestContext().getUser(), this.timeStamp);
		return this.update(tableDetails, converter, null);
	}

	public <T> T update(T entity, Condition condition) {
		TableData tableDetails = this.getTableData(entity);
		tableDetails.setUpdatedByAndUpdatedDate(this.contextManager.getRequestContext().getUser(), this.timeStamp);
		return this.update(entity, tableDetails, condition);
	}

	private Map<Field<?>, Object> getConditionAndValue(TableData tableDetails) {
		return tableDetails.getRecordDataList().stream()
				.filter(item -> item.getValue() != null && !item.isExcludeFromSelect())
				.collect(Collectors.toMap(item -> item.getField(), item -> item.getValue()));
	}

	private Map<Field<?>, Object> getUpdateValues(TableData tableDetails) {
		return tableDetails.getRecordDataList().stream()
				.filter(item -> item.getValue() != null && !item.isPrimaryKey() && !item.isAutoNumber())
				.collect(Collectors.toMap(item -> item.getField(), item -> item.getValue()));
	}

	/***
	 * Update will happen based on the primary key.
	 * 
	 * @param <T>
	 * @param entity
	 * @param tableDetails
	 * @param condition
	 * @return
	 */
	private <T> T update(TableData tableDetails, Function<Record, T> converter, Condition condition) {

		Map<Field<?>, Object> updateMap = this.getUpdateValues(tableDetails);
		// Update will happen based on primary key
		Map<Field<?>, Object> primaryKeys = tableDetails.getPrimaryKeys();
		if (condition == null && primaryKeys.size() > 0) {
			condition = DSL.condition(primaryKeys);
		}
		try {
			return converter.apply(context.update(table(tableDetails.getTableName())).set(updateMap).where(condition)
					.returning(tableDetails.getFields()).fetchOne());
		}
		catch(DataIntegrityViolationException ex) {
			throw new UniqueConstraintException(tableDetails.getTableName(), ex);
		}
		

	}

	private <T> T update(T entity, TableData tableDetails, Condition condition) {

		Map<Field<?>, Object> updateMap = this.getUpdateValues(tableDetails);
		// Update will happen based on primary key
		Map<Field<?>, Object> primaryKeys = tableDetails.getPrimaryKeys();
		if (condition == null && primaryKeys.size() > 0) {
			condition = DSL.condition(primaryKeys);
		}
		try {
			context.update(table(tableDetails.getTableName())).set(updateMap).where(condition)
			.returning(tableDetails.getFields()).fetchOne().into(entity);
		}
		catch(DataIntegrityViolationException ex) {
			throw new UniqueConstraintException(tableDetails.getTableName(), ex);
		}
		
		return entity;
	}

	protected Collection<SortField<?>> getOrderBy(Sort sort) {
		return sort.stream().map(order -> {
			String sortFieldName = order.getProperty();
			Direction direction = order.getDirection();
			return (direction == Direction.ASC ? column(sortFieldName).asc() : column(sortFieldName).desc());

		}).collect(Collectors.toList());

	}

	public <T> List<T> fetchMultiple(T entity, Function<Record, T> converter) {
		TableData tableDetails = this.getTableData(entity);
		SelectConditionStep<Record> query = this.fetchQuery(tableDetails);
		Result<Record> results = query.fetch();
		return results.map(converter::apply);
	}

	public <T> List<T> fetchMultiple(T entity, Class<T> type) {
		TableData tableDetails = this.getTableData(entity);
		SelectConditionStep<Record> query = this.fetchQuery(tableDetails);
		return query.fetchInto(type);
	}

	public <T> T fetchOne(T entity) {

		TableData tableDetails = this.getTableData(entity);
		SelectConditionStep<Record> query = this.fetchQuery(tableDetails);

		var queryResult = query.fetchOne();
		if (queryResult == null) {
			throw new NotFoundException(tableDetails.getTableName());
		}
		return queryResult.into(entity);

	}

	public <T> T fetchOne(T entity, Function<Record, T> converter) {

		TableData tableDetails = this.getTableData(entity);
		SelectConditionStep<Record> query = this.fetchQuery(tableDetails);

		var queryResult = query.fetchOne();
		if (queryResult == null) {
			throw new NotFoundException(tableDetails.getTableName());
		}
		return converter.apply(queryResult);

	}

	private SelectConditionStep<Record> fetchQuery(TableData tableDetails) {

		Map<Field<?>, Object> conditionMap = this.getConditionAndValue(tableDetails);
		if (conditionMap.size() == 0) {
			throw new InvalidConditionException(tableDetails.getTableName());
		}

		return context.select(tableDetails.getFields()).from(table(tableDetails.getTableName()))
				.where(DSL.condition(conditionMap));
	}

	public <T> int delete(T entity) {
		TableData tableDetails = this.getTableData(entity);
		return this.delete(tableDetails, null);
	}

	public int delete(TableData tableDetails, Condition condition) {
		if (condition == null) {
			Map<Field<?>, Object> map = tableDetails.getRecordDataList().stream()
					.filter(item -> item.getValue() != null && !item.isExcludeFromSelect())
					.collect(Collectors.toMap(item -> item.getField(), item -> item.getValue()));
			condition = DSL.condition(map);
		}
		return context.delete(table(tableDetails.getTableName())).where(condition).execute();
	}

	// Dynamic SQL based on table details from entity

	public <T> Page<T> fetchAll(T entity, Class<T> type, Pageable pagable) {

		TableData tableDetails = this.getTableData(entity);
		Map<Field<?>, Object> conditionMap = this.getConditionAndValue(tableDetails);

		if (conditionMap.size() == 0) {
			throw new InvalidConditionException(tableDetails.getTableName());
		}

		List<T> queryResults = this.context.selectFrom(table(tableDetails.getTableName()))
				.where(DSL.condition(conditionMap)).orderBy(this.getOrderBy(pagable.getSort()))
				.limit(pagable.getPageSize()).offset(pagable.getOffset()).fetchInto(type);

		return new PageImpl<>(queryResults);
	}
        
        public <T> Page<T> fetchFiltered(T entity, Function<Record, T> converter, Pageable pagable,JSONArray filtersJson) {
            List<Filter> filters = null;
            TableData tableDetails = this.getTableData(entity);
//            Condition conditions = FilterGenerator.generate(filters,tableDetails.getFields());
		Result<Record> result = this.context.selectFrom(table(tableDetails.getTableName()))
//                                .orderBy(this.getOrderBy(pagable.getSort()))
//                                .offset(pagable.getOffset())
//                                  .where(conditions)
                                  .limit(pagable.getPageSize())
                                  .fetch();

                List<T> queryResults = result.map(converter::apply);
		return new PageImpl<>(queryResults);
	}

	public <T> Page<T> fetchAll(T entity, Function<Record, T> converter, Pageable pagable) {

		TableData tableDetails = this.getTableData(entity);
		Map<Field<?>, Object> conditionMap = this.getConditionAndValue(tableDetails);
		if (conditionMap.size() == 0) {
			throw new InvalidConditionException(tableDetails.getTableName());
		}

		Result<Record> result = this.context.selectFrom(table(tableDetails.getTableName()))
				.where(DSL.condition(conditionMap)).orderBy(this.getOrderBy(pagable.getSort()))
				.limit(pagable.getPageSize()).offset(pagable.getOffset()).fetch();

		List<T> queryResults = result.map(converter::apply);
		return new PageImpl<>(queryResults);
	}

	public <T> Page<T> fetchAll(String tableName, Condition condition, Class<T> type, Pageable pagable) {
		
		List<T> queryResults = null;
		if(condition==null) {
			queryResults = this.context.selectFrom(table(tableName))
					.orderBy(this.getOrderBy(pagable.getSort())).limit(pagable.getPageSize()).offset(pagable.getOffset())
					.fetchInto(type);
		}
		else {
			queryResults = this.context.selectFrom(table(tableName)).where(condition)
					.orderBy(this.getOrderBy(pagable.getSort())).limit(pagable.getPageSize()).offset(pagable.getOffset())
					.fetchInto(type);
		}
		

		return new PageImpl<>(queryResults);
	}

	public <T> Page<T> fetchAll(String tableName, Condition condition, Function<Record, T> converter,
			Pageable pagable) {

		Result<Record> result = null;

		if (condition == null) {
			result = this.context.selectFrom(table(tableName)).orderBy(this.getOrderBy(pagable.getSort()))
					.limit(pagable.getPageSize()).offset(pagable.getOffset()).fetch();
		} else {
			result = this.context.selectFrom(table(tableName)).where(condition)
					.orderBy(this.getOrderBy(pagable.getSort())).limit(pagable.getPageSize())
					.offset(pagable.getOffset()).fetch();
		}

		List<T> queryResults = result.map(converter::apply);
		return new PageImpl<>(queryResults);
	}

	public <T> List<T> fetchAll(String tableName, Condition condition, Class<T> type) {
		if (condition == null) {
			return this.context.selectFrom(table(tableName)).fetchInto(type);
		}
		return this.context.selectFrom(table(tableName)).where(condition).fetchInto(type);
	}

	public <T> List<T> fetchAll(String tableName, Condition condition, Function<Record, T> converter) {
		Result<Record> result = null;
		if (condition == null) {
			result = this.context.selectFrom(table(tableName)).fetch();
		} else {
			result = this.context.selectFrom(table(tableName)).where(condition).fetch();
		}

		return result.map(converter::apply);
	}

	// Table Data details to generate the Query
	private <T> TableData getTableData(T entity) {

		TableData tableData = new TableData();
		Class<?> clazz = entity.getClass();
		javax.persistence.Table tableAnnotation = clazz.getAnnotation(javax.persistence.Table.class);

		if (tableAnnotation != null) {
			// Get the table name
			String tableName = tableAnnotation.name();
			tableData.setTableName(tableName);

			// Iterate through all the properties/attributes
			for (java.lang.reflect.Field field : clazz.getDeclaredFields()) {
				// read column annotations
				Column col = field.getAnnotation(Column.class);

				// process only if the column data annotation is present
				if (col != null) {

					String colName = col.name().toLowerCase();
					Field<?> colField = column(colName);

					// create a recordData object to hold the properties of each record
					RecordData recData = new RecordData();
					recData.setField(colField);
					recData.setAttributeName(field.getName());

					// set the record data
					this.setExtraColData(entity, tableData, tableName, colName, recData, field, colField);

				}
			}

			// Set updatedBy and updatedDate
			RecordData updatedBy = new RecordData();
			updatedBy.setAttributeName("updatedBy");
			updatedBy.setField(column(ModelConstants.UPDATED_BY));

			RecordData updatedDate = new RecordData();
			updatedDate.setAttributeName("updatedDate");
			updatedDate.setField(column(ModelConstants.UPDATED_DATE));

			tableData.getRecordDataList().add(updatedBy);
			tableData.getRecordDataList().add(updatedDate);

		}
		return tableData;
	}

	private <T> RecordData setExtraColData(T entity, TableData tableData, String tableName, String colName,
			RecordData recData, java.lang.reflect.Field field, Field<?> colField) {
		try {
			field.setAccessible(true);
			// read extra column data annotations
			ExtraColumnData extraCol = field.getAnnotation(ExtraColumnData.class);
			Object temp = field.get(entity);
			Object val = temp instanceof Enum<?> ? temp.toString() : temp;
			// process only if extracol annotation is present
			if (extraCol != null) {

				recData.setExcludeFromSelect(extraCol.exclude());
				recData.setPrimaryKey(extraCol.isPrimaryKey());
				recData.setAutoNumber(extraCol.id() == IDType.AUTO);

				// Handling of ID column
				if (extraCol.id() != null && (extraCol.id() != IDType.NONE && extraCol.id() != IDType.AUTO)
						&& val == null) {
					tableData.setIdType(extraCol.id());
					if (extraCol.id() == IDType.BUSINESS_SEQ) {
						tableData.businessString = extraCol.businessString();
					} else if (extraCol.id() == IDType.VERSION_SEQ) {
						tableData.setVersionColumn(colField);
					}
					val = ID_TEMPLATE;
				}

				// Convert to JSON string
				if (extraCol.convertToJson() && val != null) {
					ObjectMapper objectMapper = new ObjectMapper();
					JSON jsonVal = JSON.json(objectMapper.writeValueAsString(val));
					val = jsonVal;
				}
			}

			// Adding column value
			recData.setValue(val);
			tableData.getRecordDataList().add(recData);

		} catch (IllegalArgumentException | IllegalAccessException | JsonProcessingException e) {
			throw new InvalidFieldMappingException(tableName, colName, e);
		}
		return recData;
	}

	public <T> T convertJsonToObject(Record rec, Class<T> classToConvert, String tableName, String colName) {
		Object colValue = rec.get(colName);
		T result = null;
		if (colValue != null) {
			var conditionJson = JSON.json(colValue.toString());

			ObjectMapper mapper = new ObjectMapper();
			try {
				result = mapper.readValue(conditionJson.toString(), classToConvert);
			} catch (JsonProcessingException e) {
				throw new InvalidTypeConversionException(tableName, colName);
			}
		}

		return result;
	}

	public <T> List<T> convertJsonToList(Record rec, Class<T> classToConvert, String tableName, String colName) {
		var conditionJson = JSON.json(rec.get(colName).toString());
		List<T> result = new ArrayList<>();
		ObjectMapper mapper = new ObjectMapper();
		try {
			result = mapper.readerForListOf(classToConvert).readValue(conditionJson.toString());
		} catch (JsonProcessingException e) {
			throw new InvalidTypeConversionException(tableName, colName);
		}

		return result;
	}

	@Setter
	@Getter
	public class TableData {
		private String tableName;
		private Field<?> versionColumn;
		private final List<RecordData> recordDataList = new ArrayList<>();
		private IDType idType = IDType.NONE;
		private String businessString;

		public void setUpdatedByAndUpdatedDate(String user, Timestamp timeStamp) {
			this.recordDataList.forEach(item -> {
				if (item.field.getName().equals(ModelConstants.UPDATED_BY)) {
					item.setValue(user);
				} else if (item.field.getName().equals(ModelConstants.UPDATED_DATE)) {
					item.setValue(timeStamp);
				}
			});
		}

		public List<Field<?>> getFields() {
			return this.recordDataList.stream().map(item -> item.getField()).collect(Collectors.toList());
		}

		public List<Object> getValues() {
			return this.recordDataList.stream().map(item -> item.getValue()).collect(Collectors.toList());
		}

		public List<Field<?>> getFieldsAfterExclusion() {
			return this.recordDataList.stream().filter(item -> !item.isAutoNumber() && item.getValue() != null)
					.map(item -> item.getField()).collect(Collectors.toList());
		}

		public List<Object> getValuesAfterExclusion() {
			return this.recordDataList.stream().filter(item -> !item.isAutoNumber() && item.getValue() != null)
					.map(item -> item.getValue()).collect(Collectors.toList());
		}

		public Map<Field<?>, Object> getPrimaryKeys() {
			return this.recordDataList.stream().filter(item -> {
				if (item.isPrimaryKey() && item.getValue() == null) {
					throw new NullPrimaryKeyException(this.tableName, item.getAttributeName());
				}
				return item.isPrimaryKey();
			}).collect(Collectors.toMap(item -> item.getField(), item -> item.getValue()));
		}

	}

	@Getter
	@Setter
	@NoArgsConstructor
	/***
	 * Data Structure for holding the selected record
	 * 
	 * @author shabeeb
	 *
	 */
	class RecordData {
		private Object value;
		private String attributeName;
		private Field<?> field;
		private boolean isAutoNumber = false;
		private boolean isPrimaryKey = false;
		private boolean excludeFromSelect = false;
	}
}
