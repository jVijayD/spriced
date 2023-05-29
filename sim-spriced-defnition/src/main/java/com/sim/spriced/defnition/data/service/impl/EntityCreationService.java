package com.sim.spriced.defnition.data.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sim.spriced.defnition.data.repo.impl.EntityCreationRepo;
import com.sim.spriced.defnition.data.service.EntityDefnitionEvent;
import com.sim.spriced.defnition.data.service.IEntityCreationService;
import com.sim.spriced.framework.exceptions.data.CreateEntityException;
import com.sim.spriced.framework.models.EntityDefnition;
import com.sim.spriced.framework.pubsub.IObserver;

@Service
public class EntityCreationService implements IEntityCreationService, IObserver<EntityDefnitionEvent> {

	@Autowired
	EntityCreationRepo creationRepo;
	
	@Override
	public void update(EntityDefnitionEvent arg) {
		EntityDefnition entityDefnition = arg.getEntity();
		switch (arg.getType()) {
		case ADD:
			this.createDefnition(entityDefnition);
			break;
		case UPDATE:
			this.updateDefnition(entityDefnition);
			break;
		case DELETE:
			this.deleteDefnition(entityDefnition);
			break;
		default:
			throw new UnsupportedOperationException();
		}
	}

	@Override
	public int createDefnition(EntityDefnition entityDefnition) {
		entityDefnition.validate();
		return this.creationRepo.create(entityDefnition);
		
	}

	@Override
	public void updateDefnition(EntityDefnition entityDefnition) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void deleteDefnition(EntityDefnition entityDefnition) {
		 this.creationRepo.delete(entityDefnition);
	}
	
	

}
