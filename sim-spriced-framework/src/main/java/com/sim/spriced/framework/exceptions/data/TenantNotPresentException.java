package com.sim.spriced.framework.exceptions.data;

import com.sim.spriced.framework.exceptions.BaseException;

public class TenantNotPresentException extends BaseException {

	private static final long serialVersionUID = 377391022264114349L;
	private static final String CODE="CT_TN-001";

	public TenantNotPresentException(String message) {
		super(message,CODE);
	}

}
