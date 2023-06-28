package com.sim.spriced.data.rule.condition.specification;

import org.json.JSONObject;

public class IsGreaterThan extends BaseSpecification {

	public IsGreaterThan(String column, Object value) {
		super(column, value);
	}

	@Override
	public boolean isSatisfied(JSONObject input) {
		boolean result = false;
		Object value = this.getValue(input);
		if(this.isString(value)) {
			result =  this.convertToString(value).compareTo(this.value.toString()) > 0;
		}
		else if(this.isNumeric(value)) {
			result = this.convertToNumber(value) > (double) this.value;
		}
		else if(this.isBoolean(value)) {
			result = (int)value > (int)this.value;
		}
		else if(this.isDate(value)) {
			result = (this.convertToDate(value)).compareTo((java.util.Date)this.value) > 0 ;
		}
		return result;
	}

}
