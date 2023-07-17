package com.sim.spriced.defnition.data.service;

import com.sim.spriced.framework.models.EntityDefnition;
import com.sim.spriced.framework.pubsub.Event;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EntityIngestionEvent extends Event {
    private EntityDefnition entity;
}
