package com.sim.spriced.framework.exceptions.data;

import org.springframework.expression.ParseException;

/**
 *
 * @author mukil.manohar_simadv
 */
public class FilterParsingException extends ParseException {

    private static final String FORMATTER = "Filter Parsing error.[%s]";

    public FilterParsingException(String message, Throwable cause) {
        super(0, String.format(FORMATTER, cause.getMessage()));
        cause.printStackTrace();
    }

    public FilterParsingException(String message) {
        super(0, String.format(FORMATTER,""));
    }

}
