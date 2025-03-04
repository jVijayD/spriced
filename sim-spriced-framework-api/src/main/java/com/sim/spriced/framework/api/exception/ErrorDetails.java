package com.sim.spriced.framework.api.exception;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ErrorDetails {
	private Date timestamp;
	private String message;
	private String details;
	private String errorCode;
	private String requestURI;
	Map<String,String> errors = new HashMap<>();

	public ErrorDetails(Date timestamp, String message, String details,String errorCode) {
		super();
		this.timestamp = timestamp;
		this.message = message;
		this.details = details;
		this.errorCode = errorCode;
	}
}
