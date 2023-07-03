package com.sim.spriced.data.rule.action;

import org.json.JSONObject;

import com.sim.spriced.data.rule.IAction;

public class DefaultsToAction implements IAction<JSONObject> {

	private static final String DEFAULT_TO = "Default";
	private final String actionGroup;
	private final String column;
	private final Object operand;
	
	public DefaultsToAction(Object operand,String column,String actionGroup) {
		this.actionGroup = actionGroup;
		this.column = column;
		this.operand = operand;
	}

	@Override
	public String getName() {
		return DEFAULT_TO;
	}


	@Override
	public String getActionGroup() {
		return this.actionGroup;
	}
	
	@Override
	public boolean apply(JSONObject input) {
		input.put(column, this.operand);
		return true;
	}


}
