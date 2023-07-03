package com.sim.spriced.data.rule.action;

import org.json.JSONObject;

import com.sim.spriced.data.rule.IAction;

public class EqualsAction implements IAction<JSONObject> {

	private static final String EQUALS = "EqualTo";
	private final String actionGroup;
	private final String column;
	private final Object operand;
	
	public EqualsAction(Object operand,String column,String actionGroup) {
		this.actionGroup = actionGroup;
		this.column = column;
		this.operand = operand;
	}
	
	@Override
	public String getName() {
		return EQUALS;
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
