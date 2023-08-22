package com.sim.spriced.defnition.data.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.sim.spriced.framework.models.EntityDefnition;
import com.sim.spriced.framework.models.Group;
import com.sim.spriced.framework.models.Attribute;

public interface IEntityDefnitionService {

    EntityDefnition create(EntityDefnition entity);

    EntityDefnition update(EntityDefnition entity);

    int delete(String name, int groupId);

    int delete(EntityDefnition entity);

    int delete(int id);

    EntityDefnition disableEntity(String name, int groupId);

    EntityDefnition enableEntity(String name, int groupId);

    EntityDefnition fetchByName(String name, int groupId);

    EntityDefnition fetch(int id, boolean loadDisabled);

    List<EntityDefnition> fetchAll(int groupId, boolean loadDisabled);

    List<EntityDefnition> fetchAll(int groupId);

    List<EntityDefnition> fetchByRole(int groupId, String[] roles);

    EntityDefnition fetchByRole(int entityId);
    
    List<Attribute> fetchAttributesByEntityId(int entityId);
}
