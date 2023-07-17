package com.sim.spriced.defnition.data.service;

import com.sim.spriced.framework.models.EntityDefnition;

public interface IIngestionService {
    void setConnectorAndIngestData(EntityDefnition defnition);
}
