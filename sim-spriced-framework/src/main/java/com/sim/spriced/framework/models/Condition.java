package com.sim.spriced.framework.models;

import java.util.List;
import java.util.Stack;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Condition {
	private ConditionType conditionType = ConditionType.NONE;
	private String attributeId;
	private OperatorType operatorType = OperatorType.NONE;
	private Object operand = null;
	private OperandType operandType = OperandType.ATTRIBUTE;
	private ConditionType subConditionType = ConditionType.NONE;
	private List<Condition> subConditions;

	public enum ConditionType {
		NONE("none","This is used if we have only one item"),
		AND("and", "This is used as and operator."),
		OR("or", "This is used as or operator."),
		NOT("not", "This is used as not operator");
		
		private final String description;
		private final String value;
		
		private ConditionType(String value,String description) {
			this.description = description;
			this.value = value;
		}

		public String getValue() {
			return value;
		}

		public String getDescription() {
			return description;
		}
	}
	
	public enum OperatorType {
		NONE("none", "Operator to mark as no operation"),
		EQUALS("=", "Operator for equality"),
		IS_NOT_EQUAL("!=", "Operator for inequality"),
		GREATER_THAN(">", "Operator to check the greater of the two"),
		GREATER_THAN_EQUALS(">=", "Operator to check greater than or equal of the two"),
		LESS_THAN("<", "Operator to check the lesser of the two"),
		LESS_THAN_EQUALS("<=", "Operator to check lesser than or equal of the two"),
		STARTS_WITH("starts_with", "Operator to check if the value starts with a particular pattern"),
		DOES_NOT_START_WITH("does_not_start_with", "Operator to check if the value does not start with a particular pattern"),
		ENDS_WITH("ends_with", "Operator to check of the value ends with a particular pattern"),
		DOES_NOT_END_WITH("does_not_end_with", "Operator to check if the value does not end with a particular pattern"),
		CONTAINS_PATTERN("contains_pattern", "Operator to check if the value contains a pattern"),
		DOES_NOT_CONTAIN_PATTERN("does_not_contain_pattern", "Operator to check if the value does not contain a pattern"),
		CONTAINS_SUBSET("contains_subset", "Operator to check if the value contains a pattern after first N characters"),
		DOES_NOT_CONTAIN_SUBSET("does_not_contain_subset", "Operator to check if the value does not contain a pattern after first N characters"),
		HAS_CHANGED("has_changed", "Operator to check if a value has changed"),
		HAS_NOT_CHANGED("has_not_changed", "Operator to check if a value has not changed"),
		IS_BETWEEN("is_between", "Operator to check   if a value is between a range"),
		IS_NOT_BETWEEN("is_not_between", "Operator to check if a value is not between a range"),
		IS_NULL("is_null", "Operator to check if a value is null or empty"),
		IS_NOT_NULL("is_not_null", "Operator to check if a value is not null or empty");
		
		private final String value;
		private final String description;
		
		private OperatorType(String value,String description) {
			this.value = value;
			this.description = description;
		}

		public String getValue() {
			return value;
		}

		public String getDescription() {
			return description;
		}
	}
	
	public enum OperandType {
		ATTRIBUTE("attribute","This type of operand is an attribute"),
		CONSTANT("const","This type of operand is a literal");
		
		private final String value;
		private final String description;
		
		private OperandType(String value,String description) {
			this.value = value;
			this.description = description;
		}

		public String getValue() {
			return value;
		}

		public String getDescription() {
			return description;
		}
	}

	public static void getSubConditionsRecursively(Condition condition, Stack<List<Condition>> subConditionStack) {
        if(condition.getSubConditions() != null && !condition.getSubConditions().isEmpty()) {
            subConditionStack.add(condition.getSubConditions());
            for(Condition subCondition: condition.getSubConditions()) {
                getSubConditionsRecursively(subCondition, subConditionStack);
            }
        }
    }
}
