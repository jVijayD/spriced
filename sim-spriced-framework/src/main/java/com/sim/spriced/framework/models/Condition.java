package com.sim.spriced.framework.models;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Condition {
	private ConditionType conditionType=ConditionType.NONE;
	private String attributeId;
	private OperatorType operatorType = OperatorType.NONE;
	private Object operand = null;
	private OperandType operandType = OperandType.BLANK;

	public enum ConditionType {
		NONE("none","This is used if we have onlu one item"),
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
		NONE("none","No Operation"),
		ADD("add","Operator for adding."),
		SUBSTRACT("substract","Operator for substraction."),
		MULTIPLY("multiply","Operator for multiplication."),
		DIVISION("division","Operator for division.");
		
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
		ATTRIBUTE("attribute",""),
		CONSTANT("const",""),
		BLANK("blank","");
		
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
}
