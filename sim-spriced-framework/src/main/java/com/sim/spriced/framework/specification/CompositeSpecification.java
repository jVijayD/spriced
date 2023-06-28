package com.sim.spriced.framework.specification;


public interface CompositeSpecification<T> extends ISpecification<T> {
	
	public default CompositeSpecification<T> or(ISpecification<T> specification) {
		return new OrSpecification<>(this, specification);
	}
	
	public default CompositeSpecification<T> and(ISpecification<T> specification) {
		return new AndSpecification<>(this, specification);
	}
	
	public default CompositeSpecification<T> not() {
		return new NotSpecification<>(this);
	}
}
