package com.sim.spriced.data.rule.condition.specification;

import org.json.JSONObject;

public class None  extends BaseSpecification {

	protected None() {
		super(null, null,null,null);
	}

	@Override
	public boolean isSatisfied(JSONObject input) {
		return true;
	}

}
