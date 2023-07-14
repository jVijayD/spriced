package com.sim.spriced.framework.data.filters;

/**
 *
 * @author mukil.manohar_simadv
 */
public class FilterTypes {

    public enum JoinType {
        NONE(" "),
        OR("OR "),
        AND("AND ");

        private JoinType(String value) {
            this.value = value;
        }
        private final String value;

        public String getValue() {
            return value;
        }
    }

    public enum FilterType {
        CONDITION,
        CONDITIONGROUP
    }

    public enum OperatorType {
//		NONE("none", "Operator to mark as no operation"),
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
