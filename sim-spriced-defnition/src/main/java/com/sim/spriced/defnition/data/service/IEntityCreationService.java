package com.sim.spriced.defnition.data.service;

import com.sim.spriced.framework.models.EntityDefnition;

public interface IEntityCreationService {
	public EntityDefnition createDefnition(EntityDefnition entityDefnition);
	public EntityDefnition updateDefnition(EntityDefnition entityDefnition,EntityDefnition previousEntityDefnition);
	public void deleteDefnition(EntityDefnition entityDefnition);
}
