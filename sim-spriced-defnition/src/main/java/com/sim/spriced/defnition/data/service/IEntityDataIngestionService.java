package com.sim.spriced.defnition.data.service;

import com.sim.spriced.framework.models.EntityDefnition;

public interface IEntityDataIngestionService {
    void setConnectorAndIngestData(EntityDefnition defnition, String topic, String fileName);

}
