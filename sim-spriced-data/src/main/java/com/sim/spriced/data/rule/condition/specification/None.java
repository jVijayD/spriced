package com.sim.spriced.data.rule.condition.specification;

import org.json.JSONObject;

import com.sim.spriced.framework.specification.ISpecification;

public class None implements ISpecification<JSONObject> {

	@Override
	public boolean isSatisfied(JSONObject input) {
		return true;
	}

}
