package com.sim.spriced.data.service;

import java.util.List;

import org.json.JSONObject;

import com.sim.spriced.framework.models.Rule;
import com.sim.spriced.framework.rule.Result;

public interface IEntityDataRuleService {
	List<Result<JSONObject>> executeRules(List<Rule> rules,JSONObject fact); 
}
