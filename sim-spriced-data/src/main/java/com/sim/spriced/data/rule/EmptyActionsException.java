package com.sim.spriced.data.rule;

import com.sim.spriced.framework.exceptions.BaseException;

public class EmptyActionsException extends BaseException {

	private static final long serialVersionUID = 1L;
	private static final String CODE = "RL_AC_001";
	protected EmptyActionsException(String message) {
		super(message,CODE);
	}

}
