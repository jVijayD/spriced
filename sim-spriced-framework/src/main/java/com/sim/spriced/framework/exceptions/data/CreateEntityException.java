package com.sim.spriced.framework.exceptions.data;

import com.sim.spriced.framework.exceptions.DataAccessException;

public class CreateEntityException extends DataAccessException {


	private static final long serialVersionUID = 7459918069429823969L;
	private static final String CODE="DB_EC-004";
	private static final String FORMATTER= "Error in creating entity-[%s].[%s]";

	public CreateEntityException(String table) {
		super(String.format(FORMATTER, table,""),CODE);
	}

}
