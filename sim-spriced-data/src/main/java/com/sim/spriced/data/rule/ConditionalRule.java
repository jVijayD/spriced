package com.sim.spriced.data.rule;

import java.util.List;

import org.json.JSONObject;

import com.sim.spriced.framework.models.Rule;
import com.sim.spriced.framework.rule.IRule;
import com.sim.spriced.framework.rule.Result;
import com.sim.spriced.framework.specification.ISpecification;

public class ConditionalRule implements IRule<JSONObject> {
	private String name;
	private String groupName;
	private int priority;

	private final List<IAction<JSONObject>> ifActionList;
	private final List<IAction<JSONObject>> elseActionList;
	private ISpecification<JSONObject> conditions;

	@Override
	public String getName() {
		return this.name;
	}

	public List<IAction<JSONObject>> getIfActionList() {
		return ifActionList;
	}

	public List<IAction<JSONObject>> getElseActionList() {
		return elseActionList;
	}

	public void setConditionst(ISpecification<JSONObject> specification) {
		this.conditions = specification;
	}

	@Override
	public String getGroupName() {
		return this.groupName;
	}

	@Override
	public int getPriority() {
		return this.priority;
	}

	protected ConditionalRule(Rule rule, List<IAction<JSONObject>> ifActions, List<IAction<JSONObject>> elseActions) {
		this.name = rule.getName();
		this.groupName = "";// TO DO Group Name has to be finalized.
		this.priority = rule.getPriority();
		this.ifActionList = ifActions;
		this.elseActionList = elseActions;
	}

	@Override
	public boolean isMatch(JSONObject input) {
		return this.conditions.isSatisfied(input);
	}

	@Override
	public Result<JSONObject> apply(JSONObject input) {

		Result<JSONObject> result = new Result<>(this.name, this.groupName);
		if (this.isMatch(input)) {
			this.checkforEmptyActions(this.ifActionList);
			this.executeActions(this.ifActionList, input, result);

		} else {
			this.checkforEmptyActions(this.elseActionList);
			this.executeActions(this.elseActionList, input, result);
		}
		result.setMessage(this.getMessage(result.isSuccess()));
		return result;
	}

	private List<Boolean> executeActions(List<IAction<JSONObject>> actions, JSONObject input,
			Result<JSONObject> result) {
		return actions.parallelStream().map(a -> {
			boolean actionResult = a.apply(input);
			this.setResultActionMessage(actionResult, this.name, result);
			if (!actionResult) {
				result.setSuccess(actionResult);
			}
			return actionResult;
		}).toList();
	}

	private void setResultActionMessage(boolean actionResult, String actionName, Result<JSONObject> result) {
		if (!actionResult) {
			result.getActionMessages().put(this.name + "_" + actionName, "Action " + actionName + " failed.");
		} else {
			result.getActionMessages().put(this.name + "_" + actionName, "Action " + actionName + " is success.");
		}
	}

	private String getMessage(boolean isSuccess) {
		if (isSuccess) {
			return String.format("%s rule executed succesfully.", this.name);
		} else {
			return String.format("%s rule execution failed.", this.name);
		}
	}

	private void checkforEmptyActions(List<IAction<JSONObject>> actions) {
		if (actions.isEmpty()) {
			throw new EmptyActionsException("Actions cannot be empty.");
		}
	}

}
