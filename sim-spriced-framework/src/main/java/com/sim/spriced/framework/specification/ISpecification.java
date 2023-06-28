package com.sim.spriced.framework.specification;

public interface ISpecification<T> {
	boolean isSatisfied(T input);
}
