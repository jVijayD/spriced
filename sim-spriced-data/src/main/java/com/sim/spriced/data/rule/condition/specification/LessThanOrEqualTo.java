package com.sim.spriced.data.rule.condition.specification;

import org.json.JSONObject;

import com.sim.spriced.framework.models.Condition;
import com.sim.spriced.framework.models.Condition.ConditionType;
import com.sim.spriced.framework.models.Condition.OperandType;

public class LessThanOrEqualTo extends BaseSpecification {

	protected LessThanOrEqualTo(String column, Object value, ConditionType conditionType, OperandType operandType) {
		super(column, value, conditionType, operandType);
	}

	@Override
	public boolean isSatisfied(JSONObject input) {
		boolean result = false;
		Object value = null;
		if (operandType.equals(Condition.OperandType.CONSTANT)) {
			value = this.getValue(input);
		} else if (operandType.equals(Condition.OperandType.BLANK)) {
			result = this.value == null || this.value.toString().equals("");
			return result;
		} else if (operandType.equals(Condition.OperandType.ATTRIBUTE)) {
			value = input.get(this.value.toString());
		}

		if (value != null) {
			if (this.isString(value)) {
				result = this.convertToString(value).compareTo(this.value.toString()) <= 0;
			} else if (this.isNumeric(value)) {
				result = this.convertToNumber(value) <= (double) this.value;
			} else if (this.isBoolean(value)) {
				result = (int) value <= (int) this.value;
			} else if (this.isDate(value)) {
				result = (this.convertToDate(value)).compareTo((java.util.Date) this.value) <= 0;
			}
		}

		return result;
	}

}
