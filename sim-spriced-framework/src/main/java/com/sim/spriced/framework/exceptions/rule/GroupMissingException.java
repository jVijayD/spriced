package com.sim.spriced.framework.exceptions.rule;

import com.sim.spriced.framework.exceptions.BaseException;

public class GroupMissingException extends BaseException {

	private static final long serialVersionUID = 1L;
	private static final String CODE = "RL_GP-001";
	public GroupMissingException(String message) {
		super(message,CODE);
	}

}
