package com.sim.spriced.data.rule;

import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.NotImplementedException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sim.spriced.data.rule.action.DefaultsToAction;
import com.sim.spriced.data.rule.action.EqualsAction;
import com.sim.spriced.data.rule.action.IsNotValid;
import com.sim.spriced.data.rule.action.NoneAction;
import com.sim.spriced.data.rule.condition.specification.BaseSpecification;
import com.sim.spriced.data.rule.condition.specification.SpecificationFactory;
import com.sim.spriced.framework.models.Action;
import com.sim.spriced.framework.models.Action.ActionGroup;
import com.sim.spriced.framework.models.Action.ActionType;
import com.sim.spriced.framework.models.Attribute;
import com.sim.spriced.framework.models.Condition;
import com.sim.spriced.framework.models.Condition.ConditionType;
import com.sim.spriced.framework.models.Rule;
import com.sim.spriced.framework.rule.IRule;
import com.sim.spriced.framework.specification.AndSpecification;
import com.sim.spriced.framework.specification.CompositeSpecification;
import com.sim.spriced.framework.specification.ISpecification;
import com.sim.spriced.framework.specification.NotSpecification;
import com.sim.spriced.framework.specification.OrSpecification;

@Component
public class RuleFactory {

	@Autowired
	SpecificationFactory specFactory;

	public IRule<JSONObject> createInstance(Rule rule, List<Attribute> attributes) {
		List<IAction<JSONObject>> ifActionList = this.getActionList(rule.getConditionalAction().getIfActions(),
				attributes, rule.getGroup());
		List<IAction<JSONObject>> elseActionList = this.getActionList(rule.getConditionalAction().getElseActions(),
				attributes, rule.getGroup());

		ISpecification<JSONObject> condition = this.getCondition(rule.getCondition(), attributes);
		return new ConditionalRule(rule, ifActionList, elseActionList, attributes, condition);

	}

	private List<IAction<JSONObject>> getActionList(List<Action> actions, List<Attribute> attributes,
			ActionGroup ruleActionGroup) {
		return actions.parallelStream().map(item -> this.createAction(item, ruleActionGroup, attributes)).toList();
	}

	private ISpecification<JSONObject> getCondition(List<Condition> conditions, List<Attribute> attributes) {


		Optional<CompositeSpecification<JSONObject>> finalCondition = conditions.parallelStream()
				.map(item -> this.specFactory.createInstance(item, attributes)).reduce((prev, current) -> 
					 prev == null || ((BaseSpecification)current).getConditionType() == ConditionType.NONE ? current
							: this.mergeConditions(prev, current)
				);
		return finalCondition.isPresent() ? finalCondition.get() : this.specFactory.createInstance(null, null);

	}

	private IAction<JSONObject> createAction(Action action, ActionGroup ruleActionGroup, List<Attribute> attributes) {
		if (!action.getActionGroup().equals(ruleActionGroup) && !action.getActionType().equals(ActionType.NONE)) {
			throw new IllegalArgumentException("Action Group of rule and action are not matching.");
		}
		Optional<Attribute> column = attributes.stream().filter(item -> item.getId().equals(action.getAttributeId()))
				.findFirst();
		if (column.isPresent()) {
			String actionGroup = action.getActionGroup().toString();
			Object operand = action.getOperand();
			String colName = column.get().getName();
			
			
			switch (action.getActionType()) {
			case DEFAULTS_TO:
				return new DefaultsToAction(operand, colName, actionGroup);
//					case DEFAULTS_TO_CONCATNATED_VALUE:
//					case DEFAULTS_TO_GENERATED_VALUE:
			case EQUALS:
				return new EqualsAction(operand, colName, actionGroup);
//					case EQUALS_CONCATENATED_VALUE:
			case IS_NOT_VALID:
				return new IsNotValid(operand, colName, actionGroup);
//					case IS_REQUIRED:
//					case MUST_BE_BETWEEN:
//					case MUST_BE_EQUAL_TO:
//					case MUST_BE_GREATER_THAN:
//					case MUST_BE_GREATER_THAN_EQUAL:
//					case MUST_BE_LESS_THAN:
//					case MUST_BE_LESS_THAN_EQUAL:
//					case MUST_BE_UNIQUE:
//					case MUST_CONTAIN_PATTERN:
//					case MUST_HAVE_MAXIMUM_LENGTH_OF:
//					case MUST_HAVE_MINIMUM_LENGTH_OF:
//					case MUST_HAVE_ONE_OF_FOLLOWING_VALUES:
			case NONE:
				return new NoneAction(action.getActionGroup().toString());
//					case START_WORKFLOW:
			default:
				throw new NotImplementedException("Action type not implement.");
			}
		} else {
			throw new IllegalArgumentException("Matching column not present.");
		}
	}

	private CompositeSpecification<JSONObject> mergeConditions(CompositeSpecification<JSONObject> prev,
			CompositeSpecification<JSONObject> current) {
		ConditionType conditionType = ((BaseSpecification) current).getConditionType();
		switch (conditionType) {
		case AND:
			return new AndSpecification<>(prev, current);
		case OR:
			return new OrSpecification<>(prev, current);
		case NOT:
			return new NotSpecification<>(current); // TO DO: Or Condition Nedd to be validated
		default:
			throw new NotImplementedException("Condition type not implement.");

		}
	}
}
