package com.sim.spriced.defnition.data.service;

import com.sim.spriced.framework.models.EntityDefnition;

public interface IEntityIngestionService {
    void createConnectorsAndUpsert(EntityDefnition entityDefnition);

    void deleteConnector(EntityDefnition entityDefnition);

    void updateSchema(EntityDefnition entityDefnition, EntityDefnition previousDefnition);
}
