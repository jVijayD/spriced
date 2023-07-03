package com.sim.spriced.data.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sim.spriced.data.rule.RuleFactory;
import com.sim.spriced.data.service.IEntityDataRuleService;
import com.sim.spriced.framework.models.Attribute;
import com.sim.spriced.framework.models.Rule;
import com.sim.spriced.framework.rule.FactResult;
import com.sim.spriced.framework.rule.IRule;
import com.sim.spriced.framework.rule.RuleEngine;

@Service
public class EntityDataRuleService implements IEntityDataRuleService {

	@Autowired
	RuleFactory factory;

	@Override
	public List<IRule<JSONObject>> getRuleEngineRules(List<Rule> rules, List<Attribute> attributes) {
		return rules.parallelStream().map(r -> factory.createInstance(r, attributes)).toList();
	}

	@Override
	public List<FactResult<JSONObject>> executeRules(List<IRule<JSONObject>> rules, List<JSONObject> facts) {
		RuleEngine<JSONObject> engine = this.getRuleEngine();
		engine.addRules(rules);
		// To DO: Need to check for running parallel
		return facts.stream().map(engine::executeRules).toList();
	}

	// TO DO: Correct the Instance creation logic
	private RuleEngine<JSONObject> getRuleEngine() {
		List<String> groups = new ArrayList<>(Arrays.asList("DEFAULT_VALUE_ACTION", "CHANGE_VALUE_ACTION",
				"VALIDATION_ACTION", "EXTERNAL_ACTION", "USER_DEFINED_ACTION_SCRIPT"));
		return new RuleEngine<>(groups);
	}

}
