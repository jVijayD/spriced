package com.sim.spriced.data.rule.condition.specification;

import org.json.JSONObject;

import com.sim.spriced.framework.models.Condition;
import com.sim.spriced.framework.models.Condition.ConditionType;
import com.sim.spriced.framework.models.Condition.OperandType;

public class IsNull  extends BaseSpecification {

	protected IsNull(String column, Object value, ConditionType conditionType, OperandType operandType, ConditionType subConditionType) {
		super(column, value, conditionType, operandType, subConditionType);
	}

	@Override
	public boolean isSatisfied(JSONObject input) {
		boolean result = false;
		Object value = null;

		if (operandType.equals(Condition.OperandType.CONSTANT)) {
			value = this.getValue(input);
		} else if (operandType.equals(Condition.OperandType.ATTRIBUTE)) {
			value = input.get(this.value.toString());
		}

		result =  value == null || value.toString().isBlank();
 
		return result;
	}

}
