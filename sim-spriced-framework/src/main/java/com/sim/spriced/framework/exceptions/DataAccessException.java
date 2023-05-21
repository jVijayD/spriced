package com.sim.spriced.framework.exceptions;

public abstract class DataAccessException extends BaseException {


	private static final long serialVersionUID = 5655668849138142374L;
	

	
	protected DataAccessException(String message,String errorCode) {
		super(message,errorCode);

	}
	
	protected DataAccessException(String message,Throwable cause) {
		super(message,cause);

	}
	
	protected DataAccessException(String message,Throwable cause,String errorCode) {
		super(message,cause,errorCode);
	}

	

}
