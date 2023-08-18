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

    // public enum DataType {
    //     BOOLEAN,
    //     STRING,
    //     NUMBER,
    //     DATE;
        
    //     public String getValue(DataType y){
    //         return y.toString().toLowerCase(); 
    //     }
      
    // }

    public enum FilterType {
        CONDITION,
        CONDITIONGROUP
    }

    public enum OperatorType {
        EQUALS,
        IS_NOT_EQUAL,
        GREATER_THAN,
        GREATER_THAN_EQUALS,
        LESS_THAN,
        LESS_THAN_EQUALS,
        IS_NULL,
        IS_NOT_NULL,
        // String 
        IN,
        ILIKE,
        LIKE,
        IS_NOT_LIKE,
        STARTS_WITH,
        ENDS_WITH,
        CONTAINS,
        NOT_CONTAINS;

    }

}
