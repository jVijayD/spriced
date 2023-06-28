package com.sim.spriced.data.rule;

import java.util.List;

import org.json.JSONObject;
import org.springframework.stereotype.Component;

import com.sim.spriced.framework.models.Action;
import com.sim.spriced.framework.models.Rule;
import com.sim.spriced.framework.rule.IRule;

@Component
public class RuleFactory {
	private RuleFactory() {}
	
	public IRule<JSONObject> createInstance(Rule rule) {
		List<IAction<JSONObject>> ifActionList = this.getActionList(rule.getConditionalAction().getIfActions());
		List<IAction<JSONObject>> elseActionList = this.getActionList(rule.getConditionalAction().getElseActions());
		return new ConditionalRule(rule,ifActionList,elseActionList);
	}
	
	
	private List<IAction<JSONObject>> getActionList(List<Action> actions) {
		return null;
	}
}
