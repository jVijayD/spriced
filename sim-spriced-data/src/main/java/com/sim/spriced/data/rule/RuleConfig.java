package com.sim.spriced.data.rule;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.json.JSONObject;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.sim.spriced.framework.rule.RuleEngine;

@Configuration
public class RuleConfig {

	@Bean
	public RuleEngine<JSONObject> ruleEngine() {
		List<String> groups = new ArrayList<>(Arrays.asList("DEFAULT_VALUE_ACTION", "CHANGE_VALUE_ACTION",
				"VALIDATION_ACTION", "EXTERNAL_ACTION", "USER_DEFINED_ACTION_SCRIPT"));
		return new RuleEngine<>(groups);
	}
}
