package com.sim.spriced.data.service;

import java.util.List;

import org.json.JSONObject;

import com.sim.spriced.framework.models.Attribute;
import com.sim.spriced.framework.models.Rule;
import com.sim.spriced.framework.rule.FactResult;
import com.sim.spriced.framework.rule.IRule;

public interface IEntityDataRuleService { 
	List<IRule<JSONObject>> getRuleEngineRules(List<Rule> rules,List<Attribute> attributes);
	List<FactResult<JSONObject>> executeRules(List<IRule<JSONObject>> rules,List<JSONObject> facts);
}
