package com.sim.spriced.framework.rule;

public interface IRule<T> {
	String getName();
	String getGroupName();
	int getPriority();
	
	boolean isMatch(T input);
	Result<T> apply(T input);
}
