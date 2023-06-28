package com.sim.spriced.framework.specification;

public class AndSpecification<T> implements CompositeSpecification<T> {

	private final ISpecification<T> left;
	private final ISpecification<T> right;
	
	
	public AndSpecification(ISpecification<T> left,ISpecification<T> right) {
		this.left = left;
		this.right = right;
	}
	
	@Override
	public boolean isSatisfied(T input) {
		return this.left.isSatisfied(input) && this.right.isSatisfied(input);
	}

}
