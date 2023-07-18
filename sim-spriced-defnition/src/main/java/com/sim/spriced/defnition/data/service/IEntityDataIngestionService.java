package com.sim.spriced.defnition.data.service;

import com.sim.spriced.framework.models.EntityDefnition;

public interface IEntityDataIngestionService {
    void upsert(EntityDefnition defnition);

    void deleteConnector(EntityDefnition defnition);

    void updateSchema(EntityDefnition defnition);

}
