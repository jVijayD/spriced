package com.sim.spriced.defnition.data.service.impl;

import com.sim.spriced.defnition.data.repo.IEntityCreationRepo;
import com.sim.spriced.defnition.data.service.BaseService;
import com.sim.spriced.defnition.data.service.EntityDefnitionEvent;
import com.sim.spriced.framework.models.EntityDefnition;
import com.sim.spriced.framework.pubsub.IObserver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TriggerCreationService extends BaseService implements IObserver<EntityDefnitionEvent> {

    @Autowired
    IEntityCreationRepo creationRepo;

    @Override
    public void update(EntityDefnitionEvent arg) {
        EntityDefnition entityDefnition = arg.getEntity();
        switch (arg.getType()) {
            case ADD, UPDATE:
                this.createTrigger(entityDefnition);
                break;
            case DELETE:
                this.dropTrigger(entityDefnition);
                break;
            default:
                throw new UnsupportedOperationException();
        }
    }

    private void createTrigger(EntityDefnition entityDefnition){
        if (entityDefnition.getEnableAuditTrial()) {
            creationRepo.createTrigger(entityDefnition.getName());
        }
    }

    private void dropTrigger(EntityDefnition entityDefnition){
        creationRepo.dropTrigger(entityDefnition.getName());
    }
}
