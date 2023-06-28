package com.sim.spriced.data.service.impl;

import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sim.spriced.data.rule.RuleFactory;
import com.sim.spriced.data.service.IEntityDataRuleService;
import com.sim.spriced.framework.models.Rule;
import com.sim.spriced.framework.rule.IRule;
import com.sim.spriced.framework.rule.Result;
import com.sim.spriced.framework.rule.RuleEngine;

@Service
public class EntityDataRuleService implements IEntityDataRuleService {

	@Autowired
	RuleFactory factory;
	
	@Autowired 
	RuleEngine<JSONObject> engine;
	
	@Override
	public List<Result<JSONObject>> executeRules(List<Rule> rules,JSONObject fact) {
		List<IRule<JSONObject>> convertedRules = rules.parallelStream().map(r->factory.createInstance(r)).toList();
		this.engine.addRules(convertedRules);
		return this.engine.executeRules(fact);
	}

}
