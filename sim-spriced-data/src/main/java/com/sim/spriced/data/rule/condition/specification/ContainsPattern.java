package com.sim.spriced.data.rule.condition.specification;

import java.util.regex.Pattern;

import org.json.JSONObject;

import com.sim.spriced.framework.models.Condition;
import com.sim.spriced.framework.models.Condition.ConditionType;
import com.sim.spriced.framework.models.Condition.OperandType;

public class ContainsPattern extends BaseSpecification {

	public ContainsPattern(String column, Object value, ConditionType conditionType, OperandType operandType) {
		super(column, value, conditionType, operandType);
	}

	@Override
	public boolean isSatisfied(JSONObject input) {
		boolean result = false;
		Object value = null;
		if (operandType.equals(Condition.OperandType.CONSTANT)) {
			value = this.getValue(input);
		} else if (operandType.equals(Condition.OperandType.ATTRIBUTE)) {
			value = input.get(this.value.toString());
		} else if (operandType.equals(Condition.OperandType.BLANK)) {
			result = this.value == null || this.value.toString().equals("");
			return result;
		}

		if (value != null && this.isString(value)) {
			Pattern p = Pattern.compile(convertToString(value));
			result = p.matcher(this.value.toString()).find();
		}
		return result;
	}
}
