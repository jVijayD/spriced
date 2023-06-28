package com.sim.spriced.data.rule.condition.specification;

public class SpecificationFactory {
	
	private  SpecificationFactory() {}
	
	public static BaseSpecification createInstance(String type,String column, Object value) {
		
		switch (type) {
			case "isEqualTo":
				return new IsEqualTo(column, value);
			case "isNotEqualTo":
				return new IsNotEqualTo(column, value);
			case "greaterThan":
				return new IsGreaterThan(column, value);
			default:
				throw new IllegalArgumentException(String.format("Specification type -[%s] not implemented.",type));
		}
	}
}
