package com.sim.spriced.framework.pubsub;

public interface IObserver<T extends Event> {
	void update(T arg);
}
