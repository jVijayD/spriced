package com.sim.spriced.framework.exceptions.data;

import com.sim.spriced.framework.exceptions.DataAccessException;

public class NotFoundException extends DataAccessException {

	/**
	 * 
	 */
	private static final long serialVersionUID = -5373370712846033471L;
	private static final String CODE="DB_NF-006";
	private static final String FORMATTER= "Resource Not Found - [%s]";


	
	public NotFoundException(String table) {
		super(String.format(FORMATTER, table),CODE);
	}

}
