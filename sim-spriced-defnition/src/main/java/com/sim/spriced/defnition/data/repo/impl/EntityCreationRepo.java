package com.sim.spriced.defnition.data.repo.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.EnumMap;
//import java.util.EnumMap;
import java.util.List;
import java.util.stream.Collectors;

import org.jooq.Constraint;
import org.jooq.CreateTableColumnStep;
import org.jooq.DataType;
import org.jooq.Field;
import org.jooq.JSON;
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

	private static final EnumMap<AttributeConstants.DataType, QuadFunction<AttributeConstants.DataType, Integer, Boolean,Object, DataType<?>>> dataTypeMapper = new EnumMap<>(
			AttributeConstants.DataType.class);

	EntityCreationRepo() {
		this.initDataTypeMapping();
	}

	@Override
	public int create(EntityDefnition entityDefnition) {
		List<Attribute> attributes = entityDefnition.getAttributes();
		String tableName = entityDefnition.getName();
		
		// Creating Sequence if Business_Sequence data type 
		attributes.forEach(attr->{
			if(attr.getDataType()==AttributeConstants.DataType.BUSINESS_SEQUENCE) {
				String sequenceName = tableName+"_"+attr.getName();
				context.createSequenceIfNotExists(sequenceName).execute();
			}
		});
		
		CreateTableColumnStep tableCreationStep = context.createTable(tableName);
		try {

			List<Field<?>> columns = this.createColumns(attributes);
			Collection<? extends Constraint> constraints = this.createConstraints(attributes);
			return tableCreationStep.columns(columns).constraints(constraints).execute();
		} finally {
			tableCreationStep.close();
		}
	}

	@Override
	public void update(EntityDefnition entityDefnition) {
		// TODO Auto-generated method stub

	}

	@Override
	public void delete(EntityDefnition entityDefnition) {
		List<Attribute> attributes = entityDefnition.getAttributes();
		String tableName = entityDefnition.getName();
		
		// Creating Sequence if Business_Sequence data type 
		attributes.forEach(attr->{
			if(attr.getDataType()==AttributeConstants.DataType.BUSINESS_SEQUENCE) {
				String sequenceName = tableName+"_"+attr.getName();
				context.dropSequence(sequenceName).execute();
			}
		});
		context.dropTable(tableName).execute();
	}

	private Collection<? extends Constraint> createConstraints(List<Attribute> attributes) {
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
			constraint.add(DSL.constraint("pk").primaryKey(primaryKeys));
		}

		if (!CollectionUtils.isEmpty(compositeUnique)) {
			String compositeUniqueKeys = String.join(",",
					compositeUnique.stream().map(Attribute::getName).collect(Collectors.toList()));
			constraint.add(DSL.constraint("uk").unique(compositeUniqueKeys));
		}

		unique.forEach(attr -> constraint.add(DSL.constraint("uk_" + attr.getName()).unique(attr.getName())));

		foreign.forEach(attr -> {
			Constraint fkConstraint = DSL.constraint("fk_" + attr.getName()).foreignKey(attr.getName())
					.references(attr.getReferencedTable());
			constraint.add(fkConstraint);
		});

		return constraint;
	}

	private List<Field<?>> createColumns(List<Attribute> attributes) {

		return attributes.stream().map(item -> column(item.getName(),
				this.getDataType(item.getDataType(), item.getSize(), item.isNullable(), item.getDefaultValue())))
				.collect(Collectors.toList());
	}

	private void initDataTypeMapping() {
		if (dataTypeMapper.size() == 0) {
			dataTypeMapper.put(AttributeConstants.DataType.BOOLEAN, (dataType,size,nullable,defaultValue)-> SQLDataType.BOOLEAN.defaultValue((Boolean)defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.BIT, (dataType,size,nullable,defaultValue)-> SQLDataType.BIT.defaultValue((Boolean)defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.INTEGER, (dataType,size,nullable,defaultValue)-> SQLDataType.INTEGER.defaultValue((Integer)defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.DOUBLE, (dataType,size,nullable,defaultValue)-> SQLDataType.DOUBLE.defaultValue((Double)defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.FLOAT, (dataType,size,nullable,defaultValue)-> SQLDataType.FLOAT.defaultValue((Double)defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.DECIMAL, (dataType,size,nullable,defaultValue)->SQLDataType.DECIMAL.defaultValue((BigDecimal)defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.CHARACTER, (dataType,size,nullable,defaultValue)->SQLDataType.CHAR(1).defaultValue((String)defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.STRING, (dataType,size,nullable,defaultValue)->SQLDataType.NVARCHAR.defaultValue((String)defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.TEXT, (dataType,size,nullable,defaultValue)->SQLDataType.NVARCHAR.defaultValue((String)defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.LINK, (dataType,size,nullable,defaultValue)->SQLDataType.NVARCHAR(500).defaultValue((String)defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.STRING_VAR, (dataType,size,nullable,defaultValue)->SQLDataType.NVARCHAR(size).defaultValue((String)defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.JSON, (dataType,size,nullable,defaultValue)->SQLDataType.JSON.defaultValue((JSON)defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.XML, (dataType,size,nullable,defaultValue)->SQLDataType.XML.defaultValue((XML)defaultValue));
			dataTypeMapper.put(AttributeConstants.DataType.AUTO, (dataType,size,nullable,defaultValue)->SQLDataType.INTEGER.identity(true));
			dataTypeMapper.put(AttributeConstants.DataType.BUSINESS_SEQUENCE, (dataType,size,nullable,defaultValue)->SQLDataType.NVARCHAR(20));
		}
	}

	
	private DataType<?> getDataType(AttributeConstants.DataType dataType, int size, boolean nullable,
			Object defaultValue) {
		DataType<?> sqlDataType=dataTypeMapper.get(dataType) == null ? SQLDataType.NVARCHAR(15):dataTypeMapper.get(dataType).apply(dataType, size, nullable, defaultValue);
		sqlDataType = sqlDataType.nullable(nullable);
		return sqlDataType;

	}
		
	@FunctionalInterface
	interface QuadFunction<A,B,C,D,R> {
	    R apply(A a, B b, C c, D d);
	}

}
