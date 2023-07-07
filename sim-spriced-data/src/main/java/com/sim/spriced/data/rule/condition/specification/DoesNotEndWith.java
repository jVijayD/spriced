package com.sim.spriced.data.rule.condition.specification;

import org.json.JSONObject;

import com.sim.spriced.framework.models.Condition;
import com.sim.spriced.framework.models.Condition.ConditionType;
import com.sim.spriced.framework.models.Condition.OperandType;

public class DoesNotEndWith extends BaseSpecification {

	public DoesNotEndWith(String column,Object value,ConditionType conditionType,OperandType operandType) {
		super(column,value,conditionType,operandType);
	}
	
	@Override
	public boolean isSatisfied(JSONObject input) {
		boolean result = false;
		if(operandType.equals(Condition.OperandType.CONSTANT)) {
			Object value = this.getValue(input);
			if(this.isString(value)) {
				result = this.value.toString().endsWith(this.convertToString(value));
			}
		} else if(operandType.equals(Condition.OperandType.BLANK)) {
			
		} else if(operandType.equals(Condition.OperandType.ATTRIBUTE)) {
			
		}
		return result;
	}
}
