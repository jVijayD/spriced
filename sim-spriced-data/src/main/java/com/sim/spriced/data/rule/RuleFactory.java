package com.sim.spriced.data.rule;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Stack;

import org.apache.commons.lang3.NotImplementedException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sim.spriced.data.rule.action.DefaultsToAction;
import com.sim.spriced.data.rule.action.EqualsAction;
import com.sim.spriced.data.rule.action.GreaterThanAction;
import com.sim.spriced.data.rule.action.GreaterThanOrEqualAction;
import com.sim.spriced.data.rule.action.IsNotValid;
import com.sim.spriced.data.rule.action.IsValid;
import com.sim.spriced.data.rule.action.LessThanAction;
import com.sim.spriced.data.rule.action.LessThanOrEqualAction;
import com.sim.spriced.data.rule.action.MustBeEqualsAction;
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
	
	private static List<String> actionStringList = new ArrayList<>();
	
	public IRule<JSONObject> createInstance(Rule rule, List<Attribute> attributes) {
		List<IAction<JSONObject>> ifActionList = this.getActionList(rule.getConditionalAction().getIfActions(),
				attributes, rule.getGroup());
		List<IAction<JSONObject>> elseActionList = this.getActionList(rule.getConditionalAction().getElseActions(),
				attributes, rule.getGroup());

		Optional<ISpecification<JSONObject>> optionalCondition = this.getCondition(rule.getCondition(), attributes);
		ISpecification<JSONObject> condition = optionalCondition.isPresent() ? optionalCondition.get() : null;
		return new ConditionalRule(rule, ifActionList, elseActionList, attributes, condition);
	}

	private List<IAction<JSONObject>> getActionList(List<Action> actions, List<Attribute> attributes,
			ActionGroup ruleActionGroup) {
		return actions.parallelStream().map(item -> this.createAction(item, ruleActionGroup, attributes)).toList();
	}
	
	private Optional<ISpecification<JSONObject>> getCondition(List<Condition> conditions, List<Attribute> attributes) {
		if(conditions.isEmpty()) {
			return Optional.ofNullable(null);
		}
		List<CompositeSpecification<JSONObject>> finalList = new ArrayList<>();
		for(int m = 0; m < conditions.size(); m++) {
			var condition = conditions.get(m);
			Stack<List<Condition>> subConditionStack = new Stack<>();
			Condition.getSubConditionsRecursively(condition, subConditionStack);
			if(!subConditionStack.isEmpty()) {
				// get a list of specifications and their subConditionTypes
				List<List<CompositeSpecification<JSONObject>>> specifications = new ArrayList<>();
				resolveGroups(subConditionStack, specifications, attributes);

				List<ConditionType> subConditionTypes = new ArrayList<>();
				List<CompositeSpecification<JSONObject>> reducedSubConditionList = new ArrayList<>();
				for(var specs: specifications) {
					Optional<ConditionType> subCondType = specs.stream().filter(item -> ((BaseSpecification) item).getSubConditionType() != ConditionType.NONE)
							.map(item -> ((BaseSpecification) item).getSubConditionType()).findFirst();
					if(subCondType.isPresent()) {
						subConditionTypes.add(subCondType.get());
					}
					// merge all the specifications using mergeConditions
					var reducedSubCondition = specs.stream().reduce((prev, current) -> prev == null 
							|| ((BaseSpecification) current).getConditionType() == ConditionType.NONE 
							 ? current
							 : this.mergeConditions(prev, current));
					if(reducedSubCondition.isPresent()) {
						reducedSubConditionList.add(reducedSubCondition.get());
					}
				}
				CompositeSpecification<JSONObject> merged = getMergedConditions(reducedSubConditionList, subConditionTypes, true);
				List<CompositeSpecification<JSONObject>> conditionMerged = new ArrayList<>();
				conditionMerged.add(this.specFactory.createInstance(condition, attributes));
				conditionMerged.add(merged);
				CompositeSpecification<JSONObject> singleConditionMerged = getMergedConditions(conditionMerged, new ArrayList<ConditionType>(Arrays.asList(condition.getSubConditionType())), true);
				finalList.add(singleConditionMerged);
			} else {
				finalList.add(this.specFactory.createInstance(condition, attributes));
			}
		}
		// get a list of conditionTypes for the main conditions only
		var conditionTypes = conditions.stream().map(item -> this.specFactory.createInstance(item, attributes))
								.filter(item -> ((BaseSpecification) item).getConditionType() != ConditionType.NONE)
								.map(item -> ((BaseSpecification) item).getConditionType()).toList();
		var completeSolution = getMergedConditions(finalList, conditionTypes, false);

		return Optional.of(completeSolution);
	}
	
	private CompositeSpecification<JSONObject> getMergedConditions(List<CompositeSpecification<JSONObject>> list, List<ConditionType> conditionTypes, boolean isSubCondition) {
		CompositeSpecification<JSONObject> merged = null;
		
		if(list.size() > 1) {
			merged = list.get(0);
			for(int p = 1; p < list.size(); p++) {
				if(isSubCondition) {
					merged = mergeSubConditions(merged, list.get(p), conditionTypes.get(p - 1));
				} else {
					merged = mergeConditions(merged, list.get(p), conditionTypes.get(p - 1));
				}
			}
		} else if(list.size() == 1) {
			merged = list.get(0);
		}
		return merged;
	}
	
	private void resolveGroups(Stack<List<Condition>> subConditionStack, List<List<CompositeSpecification<JSONObject>>> specs, List<Attribute> attributes) {
		if(subConditionStack.isEmpty()) {
			return;
		}
		var group = subConditionStack.pop();
		specs.add(group.stream().map(item -> this.specFactory.createInstance(item, attributes)).toList());
		resolveGroups(subConditionStack, specs, attributes);
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
			String displayName = column.get().getDisplayName();
			generateActionStringForError(displayName, action, operand);
			
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
			case IS_REQUIRED:
				return new IsValid(operand, colName, actionGroup);
//					case MUST_BE_BETWEEN:
			case MUST_BE_EQUAL_TO:
				return new MustBeEqualsAction(operand, colName, actionGroup);
			case MUST_BE_GREATER_THAN:
				return new GreaterThanAction(operand, colName, actionGroup);
			case MUST_BE_GREATER_THAN_EQUAL:
				return new GreaterThanOrEqualAction(operand, colName, actionGroup);
			case MUST_BE_LESS_THAN:
				return new LessThanAction(operand, colName, actionGroup);
			case MUST_BE_LESS_THAN_EQUAL:
				return new LessThanOrEqualAction(operand, colName, actionGroup);
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
			return new AndSpecification<JSONObject>(prev, current);
		case OR:
			return new OrSpecification<JSONObject>(prev, current);
		case NOT:
			return new NotSpecification<JSONObject>(current); // TO DO: Or Condition Need to be validated
		default:
			throw new NotImplementedException("Condition type not implement.");

		}
	}
	
	private CompositeSpecification<JSONObject> mergeConditions(CompositeSpecification<JSONObject> prev,
			CompositeSpecification<JSONObject> current, ConditionType conditionType) {
		switch (conditionType) {
		case AND:
			return new AndSpecification<JSONObject>(prev, current);
		case OR:
			return new OrSpecification<JSONObject>(prev, current);
		case NOT:
			return new NotSpecification<JSONObject>(current); // TO DO: Or Condition Need to be validated
		default:
			throw new NotImplementedException("Condition type not implement.");

		}
	}
	
	private CompositeSpecification<JSONObject> mergeSubConditions(CompositeSpecification<JSONObject> prev,
			CompositeSpecification<JSONObject> current, ConditionType subConditionType) {
		switch (subConditionType) {
		case AND:
			return new AndSpecification<JSONObject>(prev, current);
		case OR:
			return new OrSpecification<JSONObject>(prev, current);
		case NOT:
			return new NotSpecification<JSONObject>(current); // TO DO: Or Condition Need to be validated
		default:
			throw new NotImplementedException("Condition type not implement.");
		}
	}
	
	public void generateActionStringForError(String displayName, Action action, Object operand) {
		String tempActionString = displayName + " " + action.getActionType().toString() + operand.toString();
		actionStringList.add(tempActionString);
	}
	
	public static List<String> getActionStringList() {
		return actionStringList;
	}
}
