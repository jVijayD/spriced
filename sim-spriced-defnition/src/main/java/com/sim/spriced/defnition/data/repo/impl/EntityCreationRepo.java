package com.sim.spriced.defnition.data.repo.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
//import java.util.EnumMap;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.jooq.Condition;
import org.jooq.Constraint;
import org.jooq.CreateTableColumnStep;
import org.jooq.DataType;
import org.jooq.Field;
import org.jooq.JSON;
import org.jooq.Query;
import org.jooq.Result;
import org.jooq.XML;
import org.jooq.impl.DSL;
import org.jooq.impl.SQLDataType;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import com.sim.spriced.defnition.data.repo.IEntityCreationRepo;
import com.sim.spriced.framework.models.Attribute;
import com.sim.spriced.framework.models.AttributeConstants;
import com.sim.spriced.framework.models.AttributeConstants.ConstraintType;
import com.sim.spriced.framework.models.EntityDefnition;
import com.sim.spriced.framework.repo.BaseRepo;

@Repository
public class EntityCreationRepo extends BaseRepo implements IEntityCreationRepo {

	private static final EnumMap<AttributeConstants.DataType, QuadFunction<AttributeConstants.DataType, Integer, Boolean, Object, DataType<?>>> dataTypeMapper = new EnumMap<>(
			AttributeConstants.DataType.class);

	EntityCreationRepo() {
		this.initDataTypeMapping();
	}

	@Override
	public int create(EntityDefnition entityDefnition) {
		List<Attribute> attributes = entityDefnition.getAttributes();
		String tableName = entityDefnition.getName();

		// Creating Sequence if Business_Sequence data type
		attributes.forEach(attr -> {
			if (attr.getDataType() == AttributeConstants.DataType.BUSINESS_SEQUENCE) {
				String sequenceName = tableName + "_" + attr.getName();
				context.createSequenceIfNotExists(sequenceName).execute();
			}
		});

		CreateTableColumnStep tableCreationStep = context.createTable(tableName);
		try {

			List<Field<?>> columns = this.createColumns(attributes);
			Collection<? extends Constraint> constraints = this.createConstraints(tableName,attributes);
			return tableCreationStep.columns(columns).constraints(constraints).execute();
		} finally {
			tableCreationStep.close();
		}
	}



	@Override
	public void delete(EntityDefnition entityDefnition) {
		List<Attribute> attributes = entityDefnition.getAttributes();
		String tableName = entityDefnition.getName();
		List<Query> queries = new ArrayList<>();

		// drop sequence Business_Sequence data type
		attributes.forEach(attr -> {
			if (attr.getDataType() == AttributeConstants.DataType.BUSINESS_SEQUENCE) {
				String sequenceName = tableName + "_" + attr.getName();
				queries.add(context.dropSequence(sequenceName));
			}
		});

		// drop primary key constraints
		String primaryKeys = String.join(",", attributes.stream().filter(item->item.getConstraintType()==ConstraintType.PRIMARY_KEY).map(Attribute::getName).collect(Collectors.toList()));
		String constraintNamePk = "uk_"+tableName+"."+primaryKeys.replace(",", ".");
		queries.add(context.alterTable(tableName).dropConstraintIfExists(constraintNamePk));
		// drop foreign key constraints
		String constraintFk = "fk_"+tableName+".";
		attributes.forEach(item->{
			if(item.getConstraintType() == ConstraintType.FOREIGN_KEY) {
				queries.add(context.alterTable(tableName).dropConstraintIfExists(constraintFk+item.getName()));
			}
		});
		// drop unique key constraints
		String constraintUk = "uk_"+tableName+".";
		attributes.forEach(item->{
			if(item.getConstraintType() == ConstraintType.UNIQUE_KEY) {
				queries.add(context.alterTable(tableName).dropConstraintIfExists(constraintUk+item.getName()));
			}
		});
		// drop composite unique key constraints
		var compositeUnique = attributes.stream().filter(item->item.getConstraintType()==ConstraintType.COMPOSITE_UNIQUE_KEY).collect(Collectors.toList());

		String compositeUniqueKeys = String.join(",",
				compositeUnique.stream().map(Attribute::getName).collect(Collectors.toList()));
		String constraintNameUk = "uk_"+tableName+"."+compositeUniqueKeys.replace(",", ".");
		queries.add(context.alterTable(tableName).dropConstraintIfExists(constraintNameUk));

		// drop table
		queries.add(context.dropTable(tableName));
		this.batchExqecute(queries);

	}

	@Override
	public void alterEntityName(String oldName, String newName) {
		context.alterTableIfExists(oldName).renameTo(newName).execute();

	}

	@Override
	public void alterAttributeName(String entityName, String oldName, String newName) {
		context.alterTableIfExists(entityName).renameColumn(oldName).to(newName).execute();

	}

	@Override
	public void addAttributes(String entityName, List<Attribute> attributes) {
		context.alterTableIfExists(entityName).add(this.createColumns(attributes)).execute();

	}

	@Override
	public void deleteAttributes(String entityName, List<String> attributes) {
		context.alterTableIfExists(entityName).drop(StringUtils.join(attributes, ",")).execute();

	}

	@Override
	public void alterAttributeDefaultValue(String entityName, String attributeName, Object defaultValue) {
		if (defaultValue == null) {
			context.alterTableIfExists(entityName).alter(attributeName).dropDefault().execute();
		} else {
			context.alterTableIfExists(entityName).alter(attributeName).setDefault(defaultValue);
		}

	}

	@Override
	public void alterAttributeDataType(String entityName, Attribute attribute) {
		context.alterTableIfExists(entityName).alter(attribute.getName()).set(this.getDataType(attribute)).execute();

	}

	@Override
	public void alterAttributeNullable(String entityName, Attribute attribute) {
		if (attribute.isNullable()) {
			context.alterTableIfExists(entityName).alter(attribute.getName()).dropNotNull();
		} else {
			context.alterTableIfExists(entityName).alter(attribute.getName()).setNotNull();
		}
	}

	@Override
	public void alterPrimaryKey(String entityName, List<Attribute> attributes) {

		Collection<Constraint> constraint = new ArrayList<>();
		Collection<Query> query = new ArrayList<>();
		String primaryKeys = String.join(",", attributes.stream().map(Attribute::getName).collect(Collectors.toList()));
		String constraintNamePk = "uk_"+entityName+"."+primaryKeys.replace(",", ".");
		constraint.add(DSL.constraint(constraintNamePk).primaryKey(primaryKeys));
		query.add(context.alterTableIfExists(entityName).dropPrimaryKey());
		query.add(context.alterTableIfExists(entityName).add(constraint));
		context.batch(query).execute();
	}

	@Override
	public void alterCompositeUniqueKey(String entityName, List<Attribute> attributes) {

		Collection<Constraint> constraint = new ArrayList<>();
		Collection<Query> query = new ArrayList<>();
		String uniqueKeys = String.join(",", attributes.stream().map(Attribute::getName).collect(Collectors.toList()));
		String constraintNameUk = "uk_"+entityName+"."+uniqueKeys.replace(",", ".");
		constraint.add(DSL.constraint(constraintNameUk).unique(uniqueKeys));
		query.add(context.alterTableIfExists(entityName).dropConstraintIfExists("uk_"+entityName));
		query.add(context.alterTableIfExists(entityName).add(constraint));

		context.batch(query).execute();
	}

	@Override
	public void alterUniqueKey(String entityName, List<Attribute> addedAttributes, List<Attribute> deletedAttributes) {
		Collection<Constraint> constraint = new ArrayList<>();
		String constraintKey = "uk_"+entityName+".";
		Collection<Query> query = new ArrayList<>();
		deletedAttributes.forEach(item -> query
				.add(context.alterTableIfExists(entityName).dropConstraint(constraintKey + item.getName())));
		addedAttributes
				.forEach(attr -> constraint.add(DSL.constraint(constraintKey + attr.getName()).unique(attr.getName())));
		query.add(context.alterTableIfExists(entityName).add(constraint));
		context.batch(query).execute();

	}

	@Override
	public void alterForeignKey(String entityName, List<Attribute> addedAttributes, List<Attribute> deletedAttributes) {
		Collection<Constraint> constraint = new ArrayList<>();
		String constraintKey = "fk_"+entityName+".";
		Collection<Query> query = new ArrayList<>();
		deletedAttributes.forEach(item -> query
				.add(context.alterTableIfExists(entityName).dropForeignKey(constraintKey + item.getName())));
		addedAttributes.forEach(attr ->
				constraint.add(DSL.constraint(constraintKey + attr.getName()).foreignKey(attr.getName())
						.references(attr.getReferencedTable()))
		);
		query.add(context.alterTableIfExists(entityName).add(constraint));
		context.batch(query).execute();

	}

	private Collection<? extends Constraint> createConstraints(String entityName,List<Attribute> attributes) {
		Collection<Constraint> constraint = new ArrayList<>();
		List<Attribute> primary = attributes.stream()
				.filter(attr -> attr.getConstraintType() == ConstraintType.PRIMARY_KEY).collect(Collectors.toList());
		List<Attribute> unique = attributes.stream()
				.filter(attr -> attr.getConstraintType() == ConstraintType.UNIQUE_KEY).collect(Collectors.toList());
		List<Attribute> compositeUnique = attributes.stream()
				.filter(attr -> attr.getConstraintType() == ConstraintType.COMPOSITE_UNIQUE_KEY)
				.collect(Collectors.toList());
		List<Attribute> foreign = attributes.stream()
				.filter(attr -> attr.getConstraintType() == ConstraintType.FOREIGN_KEY).collect(Collectors.toList());

		if (!CollectionUtils.isEmpty(primary)) {

			String primaryKeys = String.join(",",
					primary.stream().map(Attribute::getName).collect(Collectors.toList()));
			String constraintNamePk = "pk_"+entityName+"."+primaryKeys.replace(",", ".");
			constraint.add(DSL.constraint(constraintNamePk).primaryKey(primaryKeys));
		}

		if (!CollectionUtils.isEmpty(compositeUnique)) {
			String compositeUniqueKeys = String.join(",",
					compositeUnique.stream().map(Attribute::getName).collect(Collectors.toList()));
			String constraintNameUk = "uk_"+entityName+"."+compositeUniqueKeys.replace(",", ".");
			constraint.add(DSL.constraint(constraintNameUk).unique(compositeUniqueKeys));
		}

		unique.forEach(attr -> constraint.add(DSL.constraint("uk_"+entityName+ "." + attr.getName()).unique(attr.getName())));

		foreign.forEach(attr -> {
			String reference = getReference(attr.getReferencedTable(), attr.getReferencedTableId());
			Constraint fkConstraint = DSL.constraint("fk_"+entityName+"_" + attr.getName()).foreignKey(attr.getName())
					.references(reference);
			constraint.add(fkConstraint);
		});

		return constraint;
	}

	private List<Field<?>> createColumns(List<Attribute> attributes) {

		return attributes.stream().map(item -> {
			var dataType = this.getDataType(item).nullable(item.isNullable());
			return column(item.getName(), dataType);
		}).collect(Collectors.toList());

	}

	private void initDataTypeMapping() {
		
		if (dataTypeMapper.size() == 0) {
			dataTypeMapper.put(AttributeConstants.DataType.BOOLEAN, (dataType, size, nullable,
																	 defaultValue) -> SQLDataType.BOOLEAN.defaultValue((Boolean) defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.BIT,
					(dataType, size, nullable, defaultValue) -> SQLDataType.BIT.defaultValue((Boolean) defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.INTEGER, (dataType, size, nullable,
																	 defaultValue) -> SQLDataType.BIGINT.defaultValue((Long) defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.DOUBLE,
					(dataType, size, nullable, defaultValue) -> SQLDataType.DOUBLE.defaultValue((Double) defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.FLOAT,
					(dataType, size, nullable, defaultValue) -> SQLDataType.FLOAT.defaultValue((Double) defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.CHARACTER, (dataType, size, nullable,
																	   defaultValue) -> SQLDataType.CHAR(1).defaultValue((String) defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.STRING, (dataType, size, nullable,
																	defaultValue) -> SQLDataType.NVARCHAR.defaultValue((String) defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.TEXT, (dataType, size, nullable,
																  defaultValue) -> SQLDataType.NVARCHAR.defaultValue((String) defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.LINK, (dataType, size, nullable, defaultValue) -> SQLDataType
					.NVARCHAR(500).defaultValue((String) defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.STRING_VAR, (dataType, size, nullable,
																		defaultValue) -> SQLDataType.NVARCHAR(size).defaultValue((String) defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.JSON,
					(dataType, size, nullable, defaultValue) -> SQLDataType.JSON.defaultValue((JSON) defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.XML,
					(dataType, size, nullable, defaultValue) -> SQLDataType.XML.defaultValue((XML) defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.AUTO,
					(dataType, size, nullable, defaultValue) -> SQLDataType.INTEGER.identity(true));
			dataTypeMapper.put(AttributeConstants.DataType.BUSINESS_SEQUENCE,
					(dataType, size, nullable, defaultValue) -> SQLDataType.NVARCHAR(20));
			dataTypeMapper.put(AttributeConstants.DataType.TIME_STAMP,
					(dataType, size, nullable, defaultValue) -> SQLDataType.TIMESTAMP);
			dataTypeMapper.put(AttributeConstants.DataType.DATE,
					(dataType, size, nullable, defaultValue) -> SQLDataType.DATE);
			dataTypeMapper.put(AttributeConstants.DataType.DATE_TIME,
					(dataType, size, nullable, defaultValue) -> SQLDataType.LOCALDATETIME);
			dataTypeMapper.put(AttributeConstants.DataType.DECIMAL, (dataType, size, nullable,
					 defaultValue) -> SQLDataType.DECIMAL(10, size));
		}
	}

	private DataType<?> getDataType(Attribute attribute) {

		AttributeConstants.DataType dataType = attribute.getDataType();
		int size = attribute.getSize();
		boolean nullable = attribute.isNullable();
		Object defaultValue = attribute.getDefaultValue();
		if(attribute.getDataType().equals(AttributeConstants.DataType.INTEGER) && attribute.getNumberOfDecimalValues()>0 ) {
			dataType=AttributeConstants.DataType.DECIMAL;
			size=attribute.getNumberOfDecimalValues();
		}
		return dataTypeMapper.get(dataType) == null ? SQLDataType.NVARCHAR(15)
				: dataTypeMapper.get(dataType).apply(dataType, size, nullable, defaultValue);
	}

	private String getReference(String referencedTable, Object referencedTableId) {
		if (null!=referencedTable){
			return referencedTable;

		} else {
			Map<Field<?>, Object> conditionsMap = new HashMap<>();
			Field<?> idField = column("id");
			conditionsMap.put(idField, Integer.parseInt(String.valueOf(referencedTableId)));
			Condition condition = DSL.condition(conditionsMap);
			Result<?> result = this.context.selectFrom(table("entity")).where(condition).fetch();
			return String.valueOf(result.get(0).get("name"));
		}
	}

	@FunctionalInterface
	interface QuadFunction<A, B, C, D ,R> {
		R apply(A a, B b, C c, D d);
	}

}