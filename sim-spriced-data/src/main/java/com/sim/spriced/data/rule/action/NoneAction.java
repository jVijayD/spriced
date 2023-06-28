package com.sim.spriced.data.rule.action;

import com.sim.spriced.data.rule.IAction;

public class NoneAction<T> implements IAction<T> {

	private static final String NONE = "None";
	@Override
	public boolean apply(T input) {
		return true;
	}

	@Override
	public String getName() {
		return NONE;
	}

}
