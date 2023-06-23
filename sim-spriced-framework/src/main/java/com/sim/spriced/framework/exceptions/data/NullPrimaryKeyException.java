package com.sim.spriced.framework.exceptions.data;

import com.sim.spriced.framework.exceptions.DataAccessException;

public class NullPrimaryKeyException extends DataAccessException {
	/**
	 * 
	 */
	private static final long serialVersionUID = -5877537539147102323L;
	private static final String CODE="DB_NF-007";
	private static final String FORMATTER= "Primary Key cannot be null.[%s.%s]";


	
	public NullPrimaryKeyException(String table,String key) {
		super(String.format(FORMATTER, table,key),CODE);
	}
}
