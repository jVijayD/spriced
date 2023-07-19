package com.sim.spriced.defnition.data.service.impl;

import com.sim.spriced.defnition.clients.IDataIngestionService;
import com.sim.spriced.defnition.data.service.BaseService;
import com.sim.spriced.defnition.data.service.EntityIngestionEvent;
import com.sim.spriced.defnition.data.service.IEntityDataIngestionService;
import com.sim.spriced.framework.models.EntityDefnition;
import com.sim.spriced.framework.pubsub.EventType;
import com.sim.spriced.framework.pubsub.IObservable;
import com.sim.spriced.framework.pubsub.IObserver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EntityDataIngestionService extends BaseService implements IEntityDataIngestionService, IObservable<EntityIngestionEvent> {

    private List<IObserver<EntityIngestionEvent>> observers = new ArrayList<>();

    EntityDataIngestionService(List<IObserver<EntityIngestionEvent>> entityIngestionObservers) {
        entityIngestionObservers.forEach(this::register);
    }

    @Autowired
    IDataIngestionService dataIngestionService;


    @Override
    public void upsert(EntityDefnition entityDefnition) {
        this.notifyObservers(this.createEvent(entityDefnition, null, EventType.ADD));
    }

    @Override
    public void updateSchema(EntityDefnition entityDefnition, EntityDefnition previousDefnition){
        this.notifyObservers(this.createEvent(entityDefnition, previousDefnition, EventType.UPDATE));
    }

    @Override
    public void deleteConnector(EntityDefnition entityDefnition){
        this.notifyObservers(this.createEvent(entityDefnition, null, EventType.DELETE));
    }

    private EntityIngestionEvent createEvent(EntityDefnition entity,EntityDefnition previousEntity, EventType type) {
        EntityIngestionEvent arg = new EntityIngestionEvent();
        arg.setEntity(entity);
        arg.setPreviousEntity(previousEntity);
        arg.setType(type);
        return arg;
    }

    @Override
    public void register(IObserver<EntityIngestionEvent> observer) {
        this.observers.add(observer);
    }

    @Override
    public void unregister(IObserver<EntityIngestionEvent> observer) {
        this.observers.remove(observer);
    }

    @Override
    public void notifyObservers(EntityIngestionEvent arg) {
        if (this.observers != null) {
            observers.forEach(observer -> observer.update(arg));
        }
    }
}
