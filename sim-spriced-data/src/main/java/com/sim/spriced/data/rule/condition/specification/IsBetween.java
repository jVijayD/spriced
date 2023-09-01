package com.sim.spriced.data.rule.condition.specification;

import java.time.LocalDate;

import org.json.JSONObject;

import com.sim.spriced.framework.models.Condition;
import com.sim.spriced.framework.models.Condition.ConditionType;
import com.sim.spriced.framework.models.Condition.OperandType;

public class IsBetween extends BaseSpecification {

	public static final String COMMA = ",";

	public IsBetween(String column, Object value, ConditionType conditionType, OperandType operandType, ConditionType subConditionType) {
		super(column, value, conditionType, operandType, subConditionType);
	}

	@Override
	public boolean isSatisfied(JSONObject input) {
		boolean result = false;
		String start = "", end = "";
		Object value = null;

		if (operandType.equals(Condition.OperandType.CONSTANT)) {
			value = this.getValue(input);
		} else if (operandType.equals(Condition.OperandType.ATTRIBUTE)) {
			value = input.get(this.value.toString());
		}

		if (value != null) {
			String range = this.convertToString(value);
			if (range.indexOf(",") != -1) {
				String[] rangeArray = range.split(COMMA);
				start = rangeArray[0].trim();
				end = rangeArray[1].trim();
			}
			try {
				if (this.isNumeric(this.convertToNumber(start)) && this.isNumeric(this.convertToNumber(end))) {
					result = this.convertToNumber(start) >= this.convertToNumber(value)
							&& this.convertToNumber(value) <= this.convertToNumber(end);
				}
			} catch (Exception e) {
				if (this.isDate(start) && this.isDate(end)) {
					LocalDate startDate = LocalDate.parse(start.toString());
					LocalDate endDate = LocalDate.parse(end.toString());
					LocalDate toCheck = LocalDate.parse(this.convertToDate(value).toString());
					result = !(toCheck.isBefore(startDate) || toCheck.isAfter(endDate));
				} else if (this.isString(value)) {
					result = (value.toString().compareTo(start) >= 0)
							&& (value.toString().compareTo(end) <= 0);
				}
			}
		}
		return result;
	}
}
