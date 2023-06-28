package com.sim.spriced.framework.specification;

public class NotSpecification<T> implements CompositeSpecification<T> {

	private final ISpecification<T> current;

	public NotSpecification(ISpecification<T> current) {
		this.current = current;
	}
	
	@Override
	public boolean isSatisfied(T input) {
		return !this.current.isSatisfied(input);
	}

}