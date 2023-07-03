package com.sim.spriced.framework.rule;

import java.util.List;

import lombok.Data;
import lombok.Getter;

@Data
public class FactResult<T> {
	T output;
	List<Result> ruleResults;
	@Getter
	boolean isSucces = true;
	public FactResult(T output,List<Result> ruleResults) {
		this.output = output;
		this.ruleResults = ruleResults;
		this.isSucces = this.canExecute();
	}
	
	private boolean canExecute() {
		boolean result = true;
		result = this.ruleResults.stream().filter(Result::isSuccess).count() > 0;
		return result;
	}
}
