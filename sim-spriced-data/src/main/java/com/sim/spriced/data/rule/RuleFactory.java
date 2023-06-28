package com.sim.spriced.data.rule;

import org.json.JSONObject;

import com.sim.spriced.framework.models.Rule;
import com.sim.spriced.framework.rule.IRule;

public class RuleFactory {
	private RuleFactory() {}
	
	public IRule<JSONObject> createInstance(Rule rule) {
		String message = this.getMessage(rule);
		ConditionalRule conditionalRule = new ConditionalRule(rule,message);
		return conditionalRule;
	}
	
	private String getMessage(Rule rule) {
		return rule.getName();
	}
}
