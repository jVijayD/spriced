package com.sim.spriced.framework.rule;

import java.util.HashMap;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Result<T> {
	private boolean isSuccess=true;
	private String ruleName;
	private String ruleGroup;
	private final Map<String,String> actionMessages = new HashMap<>();
	private String message;
	private T output;
	
	public Result(String ruleName,String ruleGroup) {
		this.ruleGroup = ruleGroup;
		this.ruleName = ruleName;
	}
	
}
