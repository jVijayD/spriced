package com.sim.spriced.data.rule.action;

import org.json.JSONObject;

import com.sim.spriced.data.rule.IAction;
import com.sim.spriced.framework.models.Action;

public class LessThanAction extends BaseAction implements IAction<JSONObject> {

	private final String actionGroup;
	private final String column;
	private final Object operand;
	private boolean result = false;

	public LessThanAction(Object operand, String column, String actionGroup) {
		this.actionGroup = actionGroup;
		this.column = column;
		this.operand = operand;
	}

	@Override
	public String getName() {
		return Action.ActionType.MUST_BE_LESS_THAN.toString();
	}

	@Override
	public String getActionGroup() {
		return this.actionGroup;
	}

	@Override
	public boolean apply(JSONObject input) {
		Object columnValue = input.get(column);
		if (columnValue != null && operand != null) {
			if (this.isString(columnValue)) {
				result = this.convertToString(operand).compareTo(this.convertToString(columnValue)) < 0;
			} else if (this.isNumeric(columnValue)) {
				result = this.convertToNumber(operand) < this.convertToNumber(columnValue);
			} else if (this.isDate(columnValue)) {
				result = (this.convertToDate(operand)).compareTo(this.convertToDate(columnValue)) < 0;
			}
		}
		return result;
	}
}
