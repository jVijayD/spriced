package com.sim.spriced.data.rule.condition.specification;

import org.json.JSONObject;

import com.sim.spriced.framework.models.Condition;
import com.sim.spriced.framework.models.Condition.ConditionType;
import com.sim.spriced.framework.models.Condition.OperandType;

public class LessThan extends BaseSpecification {

	protected LessThan(String column, Object value, ConditionType conditionType, OperandType operandType) {
		super(column, value, conditionType, operandType);
	}

	@Override
	public boolean isSatisfied(JSONObject input) {
		boolean result = false;
		Object value = this.getValue(input);
		
		if (operandType.equals(Condition.OperandType.CONSTANT)) {	
			if (value != null) {
				if (this.isString(value)) {
					result = this.convertToString(this.value).compareTo(this.convertToString(value)) < 0;
				} else if (this.isNumeric(value)) {
					result = this.convertToNumber(this.value) < this.convertToNumber(value);
				} else if (this.isDate(value)) {
					result = (this.convertToDate(this.value)).compareTo(this.convertToDate(value)) < 0;
				}
			}
		} else if (operandType.equals(Condition.OperandType.ATTRIBUTE)) {
			Object colValue = input.get(this.value.toString());
			if (value != null && colValue != null) {
				if (this.isString(colValue) && this.isString(value)) {
					result = this.convertToString(colValue).compareTo(this.convertToString(value)) < 0;
				} else if (this.isNumeric(colValue) && this.isNumeric(value)) {
					result = this.convertToNumber(colValue) < this.convertToNumber(value);
				} else if (this.isDate(colValue) && this.isDate(value)) {
					result = (this.convertToDate(colValue)).compareTo(this.convertToDate(value)) < 0;
				}
			}
		}
		return result;
	}

}
