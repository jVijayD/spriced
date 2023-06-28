package com.sim.spriced.data.rule.condition.specification;

import java.math.BigDecimal;
import java.sql.Date;

import org.json.JSONObject;

import com.sim.spriced.framework.specification.ISpecification;

public abstract class BaseSpecification implements ISpecification<JSONObject> {
	protected String column;
	protected Object value; 
	
	protected BaseSpecification(String column,Object value) {
		this.column = column;
		this.value = value;
	}
	
	protected boolean isNumeric(Object value) {
		return value instanceof Double || value instanceof Integer || value instanceof Float || value instanceof BigDecimal;
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
