package com.sim.spriced.framework.exceptions.data;

import com.sim.spriced.framework.exceptions.DataAccessException;

public class ReferentialIntegrityException extends DataAccessException {

    private static final String CODE="DB_UK - 009";
    private static final String FORMATTER= "Group with id %d is being used by existing entity";

    public ReferentialIntegrityException(Integer groupId, Throwable ex) {
        super(String.format(FORMATTER, groupId),ex,CODE);
        this.extraData = getErrorDetails(String.valueOf(ex.getCause()));
    }

    private String getErrorDetails(String message){
        String errorDetails = "";
        if (null!=message){
            errorDetails = message.replace("org.postgresql.util.PSQLException: ERROR:", "");
        }
        return errorDetails;
    }
}
