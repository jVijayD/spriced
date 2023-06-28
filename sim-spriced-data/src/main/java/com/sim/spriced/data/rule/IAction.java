package com.sim.spriced.data.rule;

public interface IAction<T> {
	T apply(T input);
}
