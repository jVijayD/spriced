package com.sim.spriced.framework.exceptions.data;

import com.sim.spriced.framework.exceptions.DataAccessException;

public class InvalidFieldMappingException extends DataAccessException {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2576592107467874713L;
	private static final String CODE="DB_FM - 001";
	private static final String FORMATTER= "Error in mapping table-[%s] for column-[%s].[%s]";

	public InvalidFieldMappingException(String message) {
		super(message,CODE);
	}
	
	public InvalidFieldMappingException(String table,String column) {
		super(String.format(FORMATTER, table,column),CODE);
	}
	

	public InvalidFieldMappingException(String table,String column,Throwable cause) {
		super(String.format(FORMATTER, table,column,cause.getMessage()),cause,CODE);
	}
	

}
