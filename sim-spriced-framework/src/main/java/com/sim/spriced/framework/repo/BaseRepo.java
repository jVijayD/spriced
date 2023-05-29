package com.sim.spriced.framework.repo;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.persistence.Column;

import org.apache.commons.lang3.tuple.Pair;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.DataType;
import org.jooq.Field;
import org.jooq.InsertOnDuplicateStep;
import org.jooq.JSON;
import org.jooq.Param;
import org.jooq.Record;
import org.jooq.Result;
import org.jooq.SelectConditionStep;
import org.jooq.SelectField;
import org.jooq.SortField;
import org.jooq.Table;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
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
import com.sim.spriced.framework.context.ContextManager;
import com.sim.spriced.framework.exceptions.data.InvalidConditionException;
import com.sim.spriced.framework.exceptions.data.InvalidEntityFieldMappingException;
import com.sim.spriced.framework.exceptions.data.InvalidFieldMappingException;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@Repository
public abstract class BaseRepo {

	private static final String ID_TEMPLATE = "<ID>";

	@Autowired
	protected DSLContext context;

	@Autowired
	protected ContextManager contextManager;

	protected final Timestamp timeStamp;

	// Default Constructor
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
		var list = result.map(rec -> {
			JSONObject obj = new JSONObject();
			colNames.forEach(cn -> {
				try {
					obj.put(cn, rec.get(cn));
				} catch (IllegalArgumentException | JSONException e) {
					throw new InvalidEntityFieldMappingException("JSONObject", cn, e);
				}
			});
			return obj;
		});

		return new JSONArray(list);
	}

	// Dynamic SQL based on Annotations
	public <T> T create(T entity) {
		TableData tableDetails = this.getTableData(entity);
		tableDetails.setUpdatedByAndUpdatedDate(this.contextManager.getRequestContext().getUser(), this.timeStamp);
		return this.create(entity, tableDetails);
	}

	private <T> T create(T entity, TableData tableDetails) {
		if (tableDetails.getIdType() == IDType.NONE) {
			context.insertInto(table(tableDetails.getTableName()), tableDetails.getFields())
					.values(tableDetails.getValues()).returningResult(tableDetails.getFields()).fetchOne().into(entity);
		} else {

			InsertOnDuplicateStep<Record> query = this.createQueryForGeneratedID(tableDetails);
			query.returning(tableDetails.getFields()).fetchOne().into(entity);
		}

		return entity;
	}

	private InsertOnDuplicateStep<Record> createQueryForGeneratedID(TableData tableDetails) {

		InsertOnDuplicateStep<Record> insertQuery = null;
		SelectField<?>[] selectFields = this.createDynamicSelectFields(tableDetails);
		Condition condition = DSL.noCondition();
		switch (tableDetails.getIdType()) {
		case VERSION_SEQ:
			insertQuery = context.insertInto(table(tableDetails.getTableName()), tableDetails.getFields())
					.select(DSL.select(selectFields).from(table(tableDetails.getTableName()).where(condition)));
			break;
		case BUSINESS_SEQ:
		case AUTO:
		case NONE:
		default:
			insertQuery = context.insertInto(table(tableDetails.getTableName()), tableDetails.getFields())
					.values(tableDetails.getValues());
			break;
		}

		return insertQuery;
	}

	private SelectField<?>[] createDynamicSelectFields(TableData tableDetails) {

		List<SelectField<?>> slectList = new ArrayList<>();
		Iterator<Pair<Field<?>, Object>> iter = tableDetails.iterator();
		while (iter.hasNext()) {
			var item = iter.next();
			var value = item.getValue();

			if (value.equals(ID_TEMPLATE) && tableDetails.getIdType() != IDType.NONE) {
				if (tableDetails.getIdType() == IDType.VERSION_SEQ) {
					slectList.add(columnIfNull(columnMax(item.getKey().getName()).add(1), 1));
				} else if (tableDetails.getIdType() == IDType.BUSINESS_SEQ) {
					// TO DO: Need to change
					slectList.add(constant(value));
				} else if (tableDetails.getIdType() == IDType.AUTO) {
					// TO DO: Need to change
					slectList.add(constant(value));
				}
			} else {
				slectList.add(constant(value));
			}
		}

		return slectList.toArray(new SelectField<?>[slectList.size()]);
	}

	public <T> T update(T entity) {
		TableData tableDetails = this.getTableData(entity);
		tableDetails.setUpdatedByAndUpdatedDate(this.contextManager.getRequestContext().getUser(), this.timeStamp);
		return this.update(entity, tableDetails, null);
	}

	public <T> T update(T entity, TableData tableDetails, Condition condition) {

		Map<Field<?>, Object> updateMap = new HashMap<>();
		var iter = tableDetails.iterator();
		while (iter.hasNext()) {
			var item = tableDetails.iterator().next();
			Field<?> colField = item.getKey();
			Object colValue = item.getValue();
			Props prop = tableDetails.getFieldProps().get(colField.getName());
			if (colValue != null && (prop==null || !prop.isExclude())) {
				updateMap.put(colField, colValue);
			}
		}

		if (condition == null && tableDetails.getPrimaryKeys().size() > 0) {
			condition = DSL.condition(tableDetails.getPrimaryKeys());
			context.update(table(tableDetails.getTableName())).set(updateMap).where(condition)
					.returning(tableDetails.getFields()).fetchOne().into(entity);
		} else {
			context.update(table(tableDetails.getTableName())).set(updateMap).where(condition)
					.returning(tableDetails.getFields()).fetchOne().into(entity);
		}

		return entity;
	}

	public <T> Page<T> fetchAll(T entity, Class<T> type, Pageable pagable) {

		TableData tableDetails = this.getTableData(entity);
		Map<Field<?>, Object> conditionMap = new HashMap<>();

		var iter = tableDetails.iterator();
		while (iter.hasNext()) {
			var keyVal = iter.next();
			Object value = keyVal.getValue();
			Props prop = tableDetails.getFieldProps().get(keyVal.getKey().getName());
			if (value != null && (prop==null || !prop.isExclude())) {
				conditionMap.put(keyVal.getKey(), value);
			}
		}

		if (conditionMap.size() == 0) {
			throw new InvalidConditionException(tableDetails.getTableName());
		}

		List<T> queryResults = this.context.selectFrom(table(tableDetails.getTableName()))
				.where(DSL.condition(conditionMap)).orderBy(this.getOrderBy(pagable.getSort()))
				.limit(pagable.getPageSize()).offset(pagable.getOffset()).fetchInto(type);

		return new PageImpl<>(queryResults);
	}

	protected Collection<SortField<?>> getOrderBy(Sort sort) {
		return sort.stream().map(order -> {
			String sortFieldName = order.getProperty();
			Direction direction = order.getDirection();
			return (direction == Direction.ASC ? column(sortFieldName).asc()
					: column(sortFieldName).desc());
			
		}).collect(Collectors.toList());

	}

	public <T> List<T> fetchMultiple(T entity, Class<T> type) {
		SelectConditionStep<Record> query = this.fetchQuery(entity);
		return query.fetchInto(type);
	}

	public <T> T fetchOne(T entity) {

		SelectConditionStep<Record> query = this.fetchQuery(entity);
		var queryResult = query.fetchOne();
		return queryResult != null ? queryResult.into(entity) : null;

	}

	private <T> SelectConditionStep<Record> fetchQuery(T entity) {
		TableData tableDetails = this.getTableData(entity);
		Map<Field<?>, Object> conditionMap = new HashMap<>();

		var iter = tableDetails.iterator();
		while (iter.hasNext()) {
			var keyVal = iter.next();
			Object value = keyVal.getValue();
			Props prop = tableDetails.getFieldProps().get(keyVal.getKey().getName());
			if (value != null && (prop==null || !prop.isExclude())) {
				conditionMap.put(keyVal.getKey(), value);
			}
		}

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

		if (condition == null && tableDetails.getPrimaryKeys().size() > 0) {
			condition = DSL.condition(tableDetails.getPrimaryKeys());
		}
		return context.delete(table(tableDetails.getTableName())).where(condition).execute();
	}

	// Dynamic SQL based on table details from entity

	public <T> Page<T> fetchAll(String tableName, Condition condition, Class<T> type, Pageable pagable) {
		List<T> queryResults = this.context.selectFrom(table(tableName)).where(condition)
				.orderBy(this.getOrderBy(pagable.getSort())).limit(pagable.getPageSize()).offset(pagable.getOffset())
				.fetchInto(type);

		return new PageImpl<>(queryResults);
	}
	
	public <T> List<T> fetchAll(String tableName, Condition condition, Class<T> type) {
		return this.context.selectFrom(table(tableName)).where(condition).fetchInto(type);
	}

	// Table Data details to generate the Query
	private <T> TableData getTableData(T entity) {
		TableData tableData = new TableData();
		Class<?> clazz = entity.getClass();
		javax.persistence.Table tableAnnotation = clazz.getAnnotation(javax.persistence.Table.class);
		if (tableAnnotation != null) {
			String tableName = tableAnnotation.name();
			tableData.setTableName(tableName);
			for (java.lang.reflect.Field field : clazz.getDeclaredFields()) {
				Column col = field.getAnnotation(Column.class);
				ExtraColumnData extraCol = field.getAnnotation(ExtraColumnData.class);
				if (col != null) {

					String colName = col.name().toLowerCase();
					Field<?> colField = column(colName);
					tableData.getAttriButeNames().add(field.getName());
					tableData.getFields().add(colField);
					
					
					field.setAccessible(true);
					try {
						Object val = field.get(entity);
						
						boolean setVal = false;
						if (extraCol != null) {
							
							tableData.getFieldProps().put(colName, new Props(val,extraCol.exclude()));
							if (extraCol.isPrimaryKey()) {
								tableData.getPrimaryKeys().put(colField, val);
							}
							// Handling of ID column
							if (extraCol.id() != null && extraCol.id() != IDType.NONE && val ==null) {
								tableData.setIdType(extraCol.id());
								tableData.setVersionColumn(colField);
								if (extraCol.id() == IDType.BUSINESS_SEQ) {
									tableData.businessString = extraCol.businessString();
								}
								tableData.getValues().add(ID_TEMPLATE);
								// tableData.getValues().add(1);
								setVal = true;
							}
							// Convert to JSON string
							if (extraCol.convertToJson() && val != null) {
								ObjectMapper objectMapper = new ObjectMapper();
								JSON jsonVal = JSON.json(objectMapper.writeValueAsString(val));
								tableData.getValues().add(jsonVal);
								setVal = true;
							}
						}

						if (!setVal) {
							tableData.getValues().add(val);
						}

					} catch (IllegalArgumentException | IllegalAccessException | JsonProcessingException e) {
						throw new InvalidFieldMappingException(tableName, colName, e);
					}
				}
			}

			tableData.getAttriButeNames().add("updatedBy");
			tableData.getAttriButeNames().add("updatedDate");

			tableData.getFields().add(column(ModelConstants.UPDATED_BY));
			tableData.getFields().add(column(ModelConstants.UPDATED_DATE));

		}
		return tableData;
	}

	@Setter
	@Getter
	class TableData implements Iterable<Pair<Field<?>, Object>> {
		private String tableName;
		private Field<?> versionColumn;
		private List<String> attriButeNames = new ArrayList<>();
		private List<Field<?>> fields = new ArrayList<>();
		private List<Object> values = new ArrayList<>();
		private Map<String,Props> fieldProps= new HashMap<>();
		private Map<Field<?>, Object> primaryKeys = new HashMap<>();

		private IDType idType = IDType.NONE;
		private String businessString;

		@Getter(value = AccessLevel.NONE)
		@Setter(value = AccessLevel.NONE)
		private int currentIndex = 0;

		@Override
		public Iterator<Pair<Field<?>, Object>> iterator() {

			return new Iterator<Pair<Field<?>, Object>>() {

				@Override
				public boolean hasNext() {
					// TODO Auto-generated method stub
					return currentIndex < fields.size();
				}

				@Override
				public Pair<Field<?>, Object> next() {
					// TODO Auto-generated method stub
					Object value = null;
					if (currentIndex < values.size()) {
						value = values.get(currentIndex);
					}
					Pair<Field<?>, Object> item = Pair.of(fields.get(currentIndex), value);
					currentIndex++;
					return item;

				}

				@Override
				public void remove() {
					currentIndex = 0;
					Iterator.super.remove();
				}

			};
		}

		public void setUpdatedByAndUpdatedDate(String user, Timestamp timeStamp) {
			this.getValues().add(user);
			this.getValues().add(timeStamp);
		}
	}
	
	@Getter
	@Setter
	class Props {
		private Object value;
		private boolean exclude;
		
		public Props(Object value, boolean exclude) {
			this.value = value;
			this.exclude = exclude;
		}
	}
}
