package com.sim.spriced.data.rule.condition.specification;

import org.json.JSONObject;

import com.sim.spriced.framework.models.Condition;
import com.sim.spriced.framework.models.Condition.ConditionType;
import com.sim.spriced.framework.models.Condition.OperandType;

public class LessThanOrEqualTo extends BaseSpecification {

	protected LessThanOrEqualTo(String column, Object value, ConditionType conditionType, OperandType operandType, ConditionType subConditionType) {
		super(column, value, conditionType, operandType,subConditionType);
	}

	@Override
	public boolean isSatisfied(JSONObject input) {
		boolean result = false;
		Object value = this.getValue(input);
		
		if (operandType.equals(Condition.OperandType.CONSTANT)) {	
			if (value != null) {
				if (this.isString(value)) {
					result = this.convertToString(value).compareTo(this.convertToString(this.value)) <= 0;
				} else if (this.isNumeric(value)) {
					result = this.convertToNumber(value) <= this.convertToNumber(this.value);
				} else if (this.isDate(value)) {
					result = (this.convertToDate(value)).compareTo(this.convertToDate(this.value)) <= 0;
				}
			}
		} else if (operandType.equals(Condition.OperandType.ATTRIBUTE)) {
			Object colValue = input.get(this.value.toString());
			if (value != null && colValue != null) {
				if (this.isString(colValue) && this.isString(value)) {
					result = this.convertToString(value).compareTo(this.convertToString(colValue)) <= 0;
				} else if (this.isNumeric(colValue) && this.isNumeric(value)) {
					result = this.convertToNumber(value) <= this.convertToNumber(colValue);
				} else if (this.isDate(colValue) && this.isDate(value)) {
					result = (this.convertToDate(value)).compareTo(this.convertToDate(colValue)) <= 0;
				}
			}
		}
		return result;
	}
}
