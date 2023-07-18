package com.sim.spriced.defnition.data.service.impl;

import com.sim.spriced.defnition.data.service.EntityIngestionEvent;
import com.sim.spriced.defnition.data.service.IEntityDataCreationService;
import com.sim.spriced.defnition.data.service.IIngestionService;
import com.sim.spriced.framework.models.EntityDefnition;
import com.sim.spriced.framework.pubsub.IObserver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EntityDataCreationService implements IEntityDataCreationService, IObserver<EntityIngestionEvent> {

    @Autowired
    IIngestionService ingestionService;

    @Override
    public void update(EntityIngestionEvent arg) {
        switch (arg.getType()) {
            case ADD:
                this.upsert(arg.getEntity());
                break;
            case UPDATE:
                this.updateSchema(arg.getEntity());
                break;
            case DELETE:
                this.deleteConnector(arg.getEntity());
                break;
            default:
                throw new UnsupportedOperationException();
        }
    }

    @Override
    public void upsert(EntityDefnition entityDefnition) {
        this.ingestionService.createConnectorsAndUpsert(entityDefnition);
    }

    @Override
    public void deleteConnector(EntityDefnition entityDefnition){
        this.ingestionService.deleteConnector(entityDefnition);
    }

    @Override
    public void updateSchema(EntityDefnition entityDefnition){
        this.ingestionService.updateSchema(entityDefnition);
    }

}
