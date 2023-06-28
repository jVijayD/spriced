package com.sim.spriced.framework.rule;

import java.util.HashMap;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Result<T> {
	private boolean isApplied=false;
	private String ruleName;
	private String ruleGroup;
	private final Map<String,String> errors = new HashMap<>();
	private T output;
	
	public Result(String ruleName,String ruleGroup) {
		this.ruleGroup = ruleGroup;
		this.ruleName = ruleName;
	}
	
}
