package com.sim.spriced.data.rule;

public interface IAction<T> {
	String getName();
	boolean apply(T input);
}
