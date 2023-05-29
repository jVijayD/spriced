package com.sim.spriced.defnition.data.repo;

import com.sim.spriced.framework.models.EntityDefnition;

public interface IEntityCreationRepo {
	public int create(EntityDefnition entityDefnition);
	public void update(EntityDefnition entityDefnition);
	public void delete(EntityDefnition entityDefnition);

}
