package com.sim.spriced.defnition.data.service;

import com.sim.spriced.framework.models.EntityDefnition;

public interface IEntityCreationService {
	public int createDefnition(EntityDefnition entityDefnition);
	public void updateDefnition(EntityDefnition entityDefnition);
	public void deleteDefnition(EntityDefnition entityDefnition);
}
