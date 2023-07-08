package com.sim.spriced.data.rule.condition.specification;

import org.json.JSONObject;

import com.sim.spriced.framework.models.Condition;
import com.sim.spriced.framework.models.Condition.ConditionType;
import com.sim.spriced.framework.models.Condition.OperandType;

public class IsEqualTo extends BaseSpecification {

	public IsEqualTo(String column, Object value, ConditionType conditionType, OperandType operandType) {
		super(column, value, conditionType, operandType);
	}

	@Override
	public boolean isSatisfied(JSONObject input) {
		boolean result = false;
		Object value = this.getValue(input);

		if (operandType.equals(Condition.OperandType.CONSTANT)) {
			if (value != null) {
				if (this.isString(value)) {
					result = this.convertToString(value).equals(this.value.toString());
				} else if (this.isNumeric(value)) {
					result = this.convertToNumber(value) == (double) this.value;
				} else if (this.isBoolean(value)) {
					result = (int) value == (int) this.value;
				} else if (this.isDate(value)) {
					result = (this.convertToDate(value)).compareTo((java.util.Date) this.value) == 0;
				}
			}
		} else if (operandType.equals(Condition.OperandType.BLANK)) {
			result = this.value == null || this.value.toString().equals("");
			return result;
		} else if (operandType.equals(Condition.OperandType.ATTRIBUTE)) {
			Object colValue = input.get(this.value.toString());
			if (value != null && colValue != null) {
				if (this.isString(value) && this.isString(colValue)) {
					result = this.convertToString(value).equals(this.convertToString(colValue));
				} else if (this.isNumeric(value) && this.isNumeric(colValue)) {
					result = this.convertToNumber(value) == (double) colValue;
				} else if (this.isBoolean(value) && this.isBoolean(colValue)) {
					result = (int) value == (int) colValue;
				} else if (this.isDate(value) && this.isDate(colValue)) {
					result = (this.convertToDate(value)).compareTo((java.util.Date) colValue) == 0;
				}
			}
		}
		return result;
	}

}
