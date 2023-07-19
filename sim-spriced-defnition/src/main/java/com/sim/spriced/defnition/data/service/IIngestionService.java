package com.sim.spriced.defnition.data.service;

import com.sim.spriced.framework.models.EntityDefnition;

public interface IIngestionService {
    void createConnectorsAndUpsert(EntityDefnition defnition);

    void deleteConnector(EntityDefnition defnition);

    void updateSchema(EntityDefnition defnition, EntityDefnition previousDefnition);
}
