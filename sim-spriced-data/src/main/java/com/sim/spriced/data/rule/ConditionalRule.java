package com.sim.spriced.data.rule;

import java.util.ArrayList;
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
	private String message;
	
	private final List<IAction<JSONObject>> ifActionList = new ArrayList<>();
	private final List<IAction<JSONObject>> elseActionList = new ArrayList<>();
	private  ISpecification<JSONObject> conditions;

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

	protected ConditionalRule(Rule rule,String message) {
		this.name = rule.getName();
		this.groupName = "";//TO DO Group Name has to be finalized.
		this.priority = rule.getPriority();
		this.message = message;
	}

	@Override
	public boolean isMatch(JSONObject input) {
		return this.conditions.isSatisfied(input);
	}

	@Override
	public Result<JSONObject> apply(JSONObject input) {
		
		Result<JSONObject> result = new Result<>(this.name,this.groupName);
		if(this.isMatch(input)) {
			this.checkforEmptyActions(this.ifActionList);
			result.setApplied(true);
			//TO DO: Need to store the status of the action.
			this.ifActionList.forEach(item->{
				item.apply(input);
				//result.getErrors().put(this.name, this.message);
			});
		}
		else {
			this.checkforEmptyActions(this.elseActionList);
			result.setApplied(true);
			//TO DO: Need to store the status of the action.
			this.ifActionList.forEach(item->{
				item.apply(input);
				//result.getErrors().put(this.name, this.message);
			});
		}
		return result;
	}
	
	private void checkforEmptyActions(List<IAction<JSONObject>> actions) {
		if(actions.isEmpty()) {
			throw new EmptyActionsException("Actions cannot be empty.");
		}
	}

}
