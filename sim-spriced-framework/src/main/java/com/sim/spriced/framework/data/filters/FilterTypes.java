package com.sim.spriced.framework.data.filters;

/**
 *
 * @author mukil.manohar_simadv
 */
public class FilterTypes {

    public enum JoinType {
        NONE,
        OR,
        NOT,
        AND;

    }

    public enum FilterType {
        CONDITION,
        CONDITIONGROUP
    }

    public enum OperatorType {
        EQUALS,
        IN,
        ILIKE,
        LIKE,
        IS_NOT_EQUAL,
        GREATER_THAN,
        GREATER_THAN_EQUALS,
        LESS_THAN,
        LESS_THAN_EQUALS;
     
    }
    
}
