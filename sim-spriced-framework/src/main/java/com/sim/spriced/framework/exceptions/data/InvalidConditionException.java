package com.sim.spriced.framework.exceptions.data;

import com.sim.spriced.framework.exceptions.DataAccessException;


public class InvalidConditionException extends DataAccessException  {

	private static final long serialVersionUID = -6366463657882645954L;
	private static final String CODE="DB_IC-002";
	private static final String FORMATTER= "Invalid filter criteria for the table-[%s] "; 

	public InvalidConditionException(String tableName,Throwable cause) {
		super(String.format(FORMATTER, tableName),cause,CODE);
	
	}

	public InvalidConditionException(String tableName) {
		super(String.format(FORMATTER, tableName),CODE);
	
	}

}
