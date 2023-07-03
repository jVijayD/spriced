package com.sim.spriced.data.rule.condition.specification;

import org.json.JSONObject;

import com.sim.spriced.framework.models.Condition.ConditionType;
import com.sim.spriced.framework.models.Condition.OperandType;

public class IsNotEqualTo extends BaseSpecification {


	public IsNotEqualTo(String column,Object value,ConditionType conditionType,OperandType operandType) {
		super(column,value,conditionType,operandType);
	}
	
	@Override
	public boolean isSatisfied(JSONObject input) {
		return input.get(this.column)!=this.value;
	}

}
