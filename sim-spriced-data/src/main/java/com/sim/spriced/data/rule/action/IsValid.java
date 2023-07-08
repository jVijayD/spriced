package com.sim.spriced.data.rule.action;

import org.json.JSONObject;

import com.sim.spriced.data.rule.IAction;

public class IsValid implements IAction<JSONObject> {

	private static final String IS_VALID = "is_valid";
	private final String actionGroup;
	private final String column;
	private final Object operand;
	
	public IsValid(Object operand,String column,String actionGroup) {
		this.actionGroup = actionGroup;
		this.column = column;
		this.operand = operand;
	}

	@Override
	public String getName() {
		return IS_VALID;
	}


	@Override
	public String getActionGroup() {
		return this.actionGroup;
	}
	
	@Override
	public boolean apply(JSONObject input) {
		return true;
	}


}
