package com.sim.spriced.framework.exceptions;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class BaseException extends RuntimeException  {
	
	private static final long serialVersionUID = -6170198199232300736L;
	protected final String errorCode; 
	protected String extraData;
	private static final String ERR_DEFAULT="ERR_DEFAULT";
	
	protected BaseException(String message) {
		super(message);
		this.errorCode = ERR_DEFAULT;
	}
	
	protected BaseException(String message,String errorCode) {
		super(message);
		this.errorCode = errorCode;
	}
	
	protected BaseException(String message,Throwable cause) {
		super(message,cause);
		this.errorCode = ERR_DEFAULT;
	}
	
	protected BaseException(String message,Throwable cause,String errorCode) {
		super(message,cause);
		this.errorCode = errorCode;
	}
}
