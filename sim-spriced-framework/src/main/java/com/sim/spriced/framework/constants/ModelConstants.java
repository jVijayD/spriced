package com.sim.spriced.framework.constants;

import org.jooq.EnumType;

public class ModelConstants {

    public static final String UPDATED_DATE = "updated_date";
    public static final String UPDATED_BY = "updated_by";
    public static final String IS_DISABLED = "is_disabled";
    public static final String ATTRIBUTES = "attributes";
    public static final String AUTO_NUMBER = "auto_number";
    public static final String NAME = "name";
    public static final String ID = "id";
    public static final String DISPLAY_NAME = "display_name";
    public static final String VERSION = "version";
    public static final String IS_VALID = "is_valid";
    public static final String COMMENT = "comment";
    public static final String ERROR = "error";
    public static final String ENABLE_AUDIT_TRIAL = "enable_audit_trial";

    public static final String GROUP_TABLE_NAME = "group";
    public static final String ENTITY_TABLE_NAME = "entity";

    public static enum ModelPermission implements EnumType{
        DENY(1, "DENY"),
        READ(2, "READ"),
        PARTIAL(3, "PARTIAL"),
        UPDATE(4, "UPDATE");
        int priority;
        String value;

        @Override
        public String toString() {
            return getValue();
        }

        /**
         * Get the value of value
         *
         * @return the value of value
         */
        public String getValue() {
            return value;
        }

        public int getPriority() {
            return priority;
        }

        ModelPermission(int priority, String value) {
            this.priority = priority;
            this.value = value;
        }

        @Override
        public String getLiteral() {
           return value;
        }

        @Override
        public String getName() {
           return this.name();
        }
    };

}
