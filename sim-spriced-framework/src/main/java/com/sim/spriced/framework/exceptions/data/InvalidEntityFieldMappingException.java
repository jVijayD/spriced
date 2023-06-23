package com.sim.spriced.framework.exceptions.data;

import com.sim.spriced.framework.exceptions.DataAccessException;

public class InvalidEntityFieldMappingException extends DataAccessException {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 581412636726932202L;
	private static final String CODE="DB_EFM-003";
	private static final String FORMATTER= "Error in mapping table-[%s] for column-[%s].[%s]";

	public InvalidEntityFieldMappingException(String message) {
		super(message,CODE);
	}
	
	public InvalidEntityFieldMappingException(String table,String column) {
		super(String.format(FORMATTER, table,column),CODE);
	}
	

	public InvalidEntityFieldMappingException(String table,String column,Throwable cause) {
		super(String.format(FORMATTER, table,column,cause.getMessage()),cause,CODE);
	}
	
}
