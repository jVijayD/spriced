package com.sim.spriced.framework.exceptions.data;

import com.sim.spriced.framework.exceptions.DataAccessException;

public class InvalidTypeConversionException extends DataAccessException {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 4019463252275951603L;
	private static final String CODE="DB_FM - 001";
	private static final String FORMATTER= "Error in mapping table-[%s] for column-[%s].[%s]";

	public InvalidTypeConversionException(String message) {
		super(message,CODE);
	}
	
	public InvalidTypeConversionException(String table,String column) {
		super(String.format(FORMATTER, table,column),CODE);
	}
	

	public InvalidTypeConversionException(String table,String column,Throwable cause) {
		super(String.format(FORMATTER, table,column,cause.getMessage()),cause,CODE);
	}
}
