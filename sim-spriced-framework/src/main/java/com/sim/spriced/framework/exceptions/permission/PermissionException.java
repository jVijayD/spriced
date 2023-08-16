package com.sim.spriced.framework.exceptions.permission;

import com.sim.spriced.framework.exceptions.data.*;
import com.sim.spriced.framework.exceptions.DataAccessException;

public class PermissionException extends DataAccessException {


	private static final long serialVersionUID = 7459918069429823969L;
	private static final String CODE="PER-001";
	private static final String FORMATTER= "Error fetching data-[%s].[%s]";

	public PermissionException(String table) {
		super(String.format(FORMATTER, table,""),CODE);
	}

}
