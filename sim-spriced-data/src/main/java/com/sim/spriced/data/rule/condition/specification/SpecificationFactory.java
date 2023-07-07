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
		if (column.isPresent()) {
			String colName = column.get().getName();
			switch (condition.getOperatorType()) {
//			case CONTAINS_PATTERN:
//			case CONTAINS_SUBSET:
//			case DOES_NOT_CONTAIN_PATTERN:
//			case DOES_NOT_CONTAIN_SUBSET:
//			case DOES_NOT_END_WITH:
//			case DOES_NOT_START_WITH:
//			case ENDS_WITH:
			case EQUALS:
				return new IsEqualTo(colName, condition.getOperand(), condition.getConditionType(), condition.getOperandType());
			case GREATER_THAN:
				return new IsGreaterThan(colName, condition.getOperand(), condition.getConditionType(), condition.getOperandType());
//			case GREATER_THAN_EQUALS:
//			case HAS_CHANGED:
//			case HAS_NOT_CHANGED:
//			case IS_BETWEEN:
//			case IS_NOT_BETWEEN:
			case LESS_THAN:
				return new LessThan(colName, condition.getOperand(), condition.getConditionType(), condition.getOperandType());
//			case LESS_THAN_EQUALS:
//			case STARTS_WITH:
			case NONE:
			default:
				return new None();
			}
		}
		else {
			throw new IllegalArgumentException("Matching column not present.");
		}

	}
}
