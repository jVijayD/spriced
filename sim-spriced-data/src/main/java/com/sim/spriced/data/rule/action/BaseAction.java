package com.sim.spriced.data.rule.action;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Date;

import org.json.JSONObject;

import com.sim.spriced.data.rule.IAction;

public class BaseAction {
	
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

}
