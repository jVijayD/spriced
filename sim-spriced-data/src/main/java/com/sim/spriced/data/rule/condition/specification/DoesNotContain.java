package com.sim.spriced.data.rule.condition.specification;

import java.util.regex.Pattern;

import org.json.JSONObject;

import com.sim.spriced.framework.models.Condition;
import com.sim.spriced.framework.models.Condition.ConditionType;
import com.sim.spriced.framework.models.Condition.OperandType;

public class DoesNotContain extends BaseSpecification {

	public DoesNotContain(String column,Object value,ConditionType conditionType,OperandType operandType) {
		super(column,value,conditionType,operandType);
	}
	
	@Override
	public boolean isSatisfied(JSONObject input) {
		boolean result = false;
		if(operandType.equals(Condition.OperandType.CONSTANT)) {
			Object value = this.getValue(input);
			if(this.isString(value)) {
				result = this.value.toString().contains(this.convertToString(value));
			}
		} else if(operandType.equals(Condition.OperandType.BLANK)) {
			
		} else if(operandType.equals(Condition.OperandType.ATTRIBUTE)) {
			
		}
		return result;
	}
}
