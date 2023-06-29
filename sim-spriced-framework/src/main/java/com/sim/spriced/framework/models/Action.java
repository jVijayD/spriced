package com.sim.spriced.framework.models;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Action {
	private String attributeId;
	private ActionGroup actionGroup = ActionGroup.DEFAULT_VALUE_ACTION;
	private ActionType actionType = ActionType.NONE;
	private Object operand = null;
	
	public enum ActionGroup {
		DEFAULT_VALUE_ACTION("default_value_action", "Used to group default actions"),
		CHANGE_VALUE_ACTION("change_value_action", "Used to group change value actions"),
		VALIDATION_ACTION("validation_action", "Used to group validating actions"),
		EXTERNAL_ACTION("external_action", "Used to group external actions to start a workflow"),
		USER_DEFINED_ACTION_SCRIPT("user_defined_action_script", "Used to group User defined scripts");
		
		private final String value;
		private final String description;
		
		private ActionGroup(String value,String description) {
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
	
	public enum ActionType {
		NONE("none", "Operator to mark as no operation"),
		DEFAULTS_TO("defaults_to", "Selected attribute defaults to a specific attribute, a specific attribute value, or is blank"),
		DEFAULTS_TO_GENERATED_VALUE("defaults_to_generated_value", "Selected attribute defaults to a generated value determined by a starting / incremental value"),
		DEFAULTS_TO_CONCATNATED_VALUE("defaults_to_concatenated_value", "Selected attribute defaults to a concatenated value that is determined by specifying multiple attributes"),
		EQUALS("equals", "Selected attribute is changed to a defined attribute value or blank"),
		EQUALS_CONCATENATED_VALUE("equals_concatenated_value", "Selected attribute is changed to a concatenated value, which is determined by specifying multiple attributes"),
		IS_REQUIRED("is_required", "Selected attribute is required, which means it cannot be null or blank"),
		IS_NOT_VALID("is_not_valid", "Selected attribute is not valid"),
		MUST_CONTAIN_PATTERN("must_contain_pattern", "Selected attribute must contain the pattern that is specified"),
		MUST_BE_UNIQUE("must_be_unique", "Selected attribute must be unique independently or in combination with defined attributes"),
		MUST_HAVE_ONE_OF_FOLLOWING_VALUES("must_have_one_of_following_values", "Selected attribute must have one of the values specified in a list"),
		MUST_BE_GREATER_THAN("must_be_greater_than", "Selected attribute must be greater than a specific attribute, a specific attribute value, or blank"),
		MUST_BE_EQUAL_TO("must_be_equal_to", "Selected attribute must be equal to a defined attribute value, another attribute, or blank"),
		MUST_BE_GREATER_THAN_EQUAL("must_be_greater_than_equals", "Selected attribute must be greater than or equal to a specific attribute, a specific attribute value, or blank"),
		MUST_BE_LESS_THAN("must_be_less_than", "Selected attribute must be greater than or equal to a specific attribute, a specific attribute value, or blank"),
		MUST_BE_LESS_THAN_EQUAL("must_be_less_than_equal", "Selected attribute must be less than or equal to a specific attribute, a specific attribute value, or blank"),
		MUST_BE_BETWEEN("must_be_between", "Selected attribute must be between two specific attribute or attribute values"),
		MUST_HAVE_MINIMUM_LENGTH_OF("must_have_minimum_length_of", "Selected attribute must have a minimum length of the specified value"),
		MUST_HAVE_MAXIMUM_LENGTH_OF("must_have_maximum_length_of", "Selected attribute must have a maximum length of the specified value"),
		START_WORKFLOW("start_workflow", "Initiates an external workflow");
		
		private final String value;
		private final String description;
		
		private ActionType(String value,String description) {
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
}
