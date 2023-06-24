package com.sim.spriced.framework.api.exception;

import com.sim.spriced.framework.exceptions.BaseException;

public class ResourceNotFoundException extends BaseException {

	private static final long serialVersionUID = -7715276582646879780L;
	private static final String CODE = "EX404";
	public ResourceNotFoundException(String message) {
		super(message,CODE);
		// TODO Auto-generated constructor stub
	}

}
