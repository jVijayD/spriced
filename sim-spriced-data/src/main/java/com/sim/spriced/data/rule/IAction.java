package com.sim.spriced.data.rule;

public interface IAction<T> {
	String getName();
	String getActionGroup();
	boolean apply(T input);
}
