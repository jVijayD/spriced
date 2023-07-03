package com.sim.spriced.data.rule.action;

import org.json.JSONObject;

import com.sim.spriced.data.rule.IAction;

public class NoneAction implements IAction<JSONObject> {

	private static final String NONE = "None";
	private final String actionGroup;
	@Override
	public boolean apply(JSONObject input) {
		return true;
	}

	@Override
	public String getName() {
		return NONE;
	}

	@Override
	public String getActionGroup() {
		return this.actionGroup;
	}
	
	public NoneAction(String actionGroup) {
		this.actionGroup = actionGroup;
	}

}
