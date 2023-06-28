package com.sim.spriced.data.rule.condition.specification;

import org.json.JSONObject;

public class IsEqualTo extends BaseSpecification  {

	public IsEqualTo(String column,Object value) {
		super(column,value);
	}
	
	@Override
	public boolean isSatisfied(JSONObject input) {
		return input.get(this.column).equals(this.value);
	}

}
