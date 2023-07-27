package com.sim.spriced.data.rule.condition.specification;

import java.util.List;
import java.util.Optional;

import org.json.JSONObject;
import org.springframework.stereotype.Component;

import com.sim.spriced.framework.models.Attribute;
import com.sim.spriced.framework.models.Condition;
import com.sim.spriced.framework.specification.CompositeSpecification;

@Component
public class SpecificationFactory {

	private SpecificationFactory() {
	}

	public CompositeSpecification<JSONObject> createInstance(Condition condition, List<Attribute> attributes) {
		Optional<Attribute> column = attributes.stream().filter(item -> item.getId().equals(condition.getAttributeId()))
				.findFirst();
		
		Object operand = condition.getOperandType().equals(Condition.OperandType.ATTRIBUTE) ? this.getColumnName(condition.getOperand().toString(), attributes) : condition.getOperand(); 
		
		if (column.isPresent()) {
			String colName = column.get().getName();
			switch (condition.getOperatorType()) {
			case CONTAINS_PATTERN:
				return new ContainsPattern(colName, operand, condition.getConditionType(), condition.getOperandType(), condition.getSubConditionType());
//			case CONTAINS_SUBSET:
			case DOES_NOT_CONTAIN_PATTERN:
				return new DoesNotContainPattern(colName, operand, condition.getConditionType(), condition.getOperandType(), condition.getSubConditionType());
//			case DOES_NOT_CONTAIN_SUBSET:
			case DOES_NOT_END_WITH:
				return new DoesNotEndWithPattern(colName, operand, condition.getConditionType(), condition.getOperandType(), condition.getSubConditionType());
			case DOES_NOT_START_WITH:
				return new DoesNotStartWithPattern(colName, operand, condition.getConditionType(), condition.getOperandType(), condition.getSubConditionType());
			case EQUALS:
				return new IsEqualTo(colName, operand, condition.getConditionType(), condition.getOperandType(), condition.getSubConditionType());
			case IS_NOT_EQUAL:
				return new IsNotEqualTo(colName, operand, condition.getConditionType(), condition.getOperandType(), condition.getSubConditionType());
			case GREATER_THAN:
				return new IsGreaterThan(colName, operand, condition.getConditionType(), condition.getOperandType(), condition.getSubConditionType());
			case GREATER_THAN_EQUALS:
				return new IsGreaterThanOrEqualTo(colName, operand, condition.getConditionType(), condition.getOperandType(), condition.getSubConditionType());
//			case HAS_CHANGED:
//			case HAS_NOT_CHANGED:
			case IS_BETWEEN:
				return new IsBetween(colName, operand, condition.getConditionType(), condition.getOperandType(), condition.getSubConditionType());
			case IS_NOT_BETWEEN:
				return new IsNotBetween(colName, operand, condition.getConditionType(), condition.getOperandType(), condition.getSubConditionType());
			case LESS_THAN:
				return new LessThan(colName, operand, condition.getConditionType(), condition.getOperandType(), condition.getSubConditionType());
			case LESS_THAN_EQUALS:
				return new LessThanOrEqualTo(colName, operand, condition.getConditionType(), condition.getOperandType(), condition.getSubConditionType());
			case STARTS_WITH:
				return new StartsWithPattern(colName, operand, condition.getConditionType(), condition.getOperandType(), condition.getSubConditionType());
			case NONE:
			default:
				return new None();
			}
		}
		else {
			throw new IllegalArgumentException("Matching column not present.");
		}	

	}
	
	private String getColumnName(String attributeId,List<Attribute> attributes) {
		Optional<Attribute> column = attributes.stream().filter(item -> item.getId().equals(attributeId))
				.findFirst();
		return column.isPresent() ? column.get().getName() : "";
	}
}
