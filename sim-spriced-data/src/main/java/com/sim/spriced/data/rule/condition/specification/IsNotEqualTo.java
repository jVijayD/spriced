package com.sim.spriced.data.rule.condition.specification;

import org.json.JSONObject;

public class IsNotEqualTo extends BaseSpecification {


	public IsNotEqualTo(String column,Object value) {
		super(column,value);
	}
	
	@Override
	public boolean isSatisfied(JSONObject input) {
		return input.get(this.column)!=this.value;
	}

}
