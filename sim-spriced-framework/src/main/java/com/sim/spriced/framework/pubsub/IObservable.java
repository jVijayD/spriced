package com.sim.spriced.framework.pubsub;

public interface IObservable<T extends Event> {

    void register(IObserver<T> observer);
    void unregister(IObserver<T> observer);
    void notifyObservers(T arg);
}

