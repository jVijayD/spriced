package com.sim.spriced.data.rule.condition.specification;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Date;

import org.json.JSONObject;

import com.sim.spriced.framework.models.Condition.ConditionType;
import com.sim.spriced.framework.models.Condition.OperandType;
import com.sim.spriced.framework.specification.CompositeSpecification;

public abstract class BaseSpecification implements CompositeSpecification<JSONObject> {
	protected String column;
	protected Object value; 
	protected ConditionType conditionType;
	protected OperandType operandType;
	protected ConditionType subConditionType;
	
	protected BaseSpecification(String column,Object value,ConditionType conditionType,OperandType operandType, ConditionType subConditionType) {
		this.column = column;
		this.value = value;
		this.conditionType = conditionType;
		this.operandType = operandType;
		this.subConditionType = subConditionType;
	}
	
	public ConditionType getConditionType() {
		return conditionType;
	}
	
	public ConditionType getSubConditionType() {
		return subConditionType;
	}

	protected boolean isNumeric(Object value) {
		return value instanceof Double || value instanceof Integer || value instanceof Float
				|| value instanceof BigDecimal || value instanceof BigInteger;
	}
	
	protected boolean isString(Object value) {
		return value instanceof String;
	}
	
	protected boolean isBoolean(Object value) {
		return value instanceof Boolean;
	}
	
	protected boolean isDate(Object value) {
		return value instanceof Date;
	}
	
	protected double convertToNumber(Object value) {
		if (value instanceof Integer) {
			return ((Integer) value).doubleValue();
		} else if (value instanceof BigInteger) {
			return ((BigInteger) value).doubleValue();
		} else if (value instanceof String) {
			return Double.parseDouble(value.toString());
		}
		return (double) value;
	}
	
	protected Date convertToDate(Object value) {
		return (Date) value;
	}
	
	protected String convertToString(Object value) {
		return (String) value;
	}
	
	protected Object getValue(JSONObject input) {
		return input.get(column);
	}
}
