package com.sim.spriced.framework.exceptions.data;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.sim.spriced.framework.exceptions.DataAccessException;

public class UniqueConstraintException extends DataAccessException {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -8036859605988255958L;
	private static final String CODE="DB_UK-008";
	private static final String FORMATTER= "Unique constraint violation.[%s]";


	
	public UniqueConstraintException(String table,Throwable ex) {
		super(String.format(FORMATTER, table),ex,CODE);
		this.extraData = this.getColName(ex.getMessage());
	}
	
	private String getColName(String message) {
		String regex = "\\(name\\)=\\([a-zA-Z0-9]+\\)";
		String name="";
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(message);
		if(matcher.find()) {
			name =matcher.group();
			name = name.replace("(name)=(", "").replace(")", "");
		}
		return name;
	}
}
