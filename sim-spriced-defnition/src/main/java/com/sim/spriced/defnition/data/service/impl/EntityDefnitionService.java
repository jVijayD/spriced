package com.sim.spriced.defnition.data.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sim.spriced.defnition.data.repo.impl.EntityDefnitionRepo;
import com.sim.spriced.defnition.data.service.EntityDefnitionEvent;
import com.sim.spriced.defnition.data.service.IEntityDefnitionService;
import com.sim.spriced.framework.models.EntityDefnition;
import com.sim.spriced.framework.pubsub.EventType;
import com.sim.spriced.framework.pubsub.IObservable;
import com.sim.spriced.framework.pubsub.IObserver;

@Service
public class EntityDefnitionService 
		implements IEntityDefnitionService, IObservable<EntityDefnitionEvent> {

	private List<IObserver<EntityDefnitionEvent>> observers = new ArrayList<>();

	@Autowired
	EntityDefnitionRepo defnitionRepo;

	EntityDefnitionService(List<IObserver<EntityDefnitionEvent>> entityDefnitionObservers) {
		entityDefnitionObservers.forEach(this::register);
	}

	@Override
	@Transactional
	public EntityDefnition create(EntityDefnition entityDefnition) {
		//disable all previous entity definitions
		this.disableEntity(entityDefnition.getName());
		entityDefnition = this.defnitionRepo.create(entityDefnition);
		this.notifyObservers(this.createEvent(entityDefnition, EventType.ADD));
		return entityDefnition;
	}

	@Override
	@Transactional
	public int delete(String name,int version,String grpname) {
		EntityDefnition entityDefnition = new EntityDefnition();
		entityDefnition.setName(name);
		entityDefnition.setVersion(version);
		entityDefnition.setGroup(grpname);
		int rows = this.defnitionRepo.delete(entityDefnition);
		this.notifyObservers(this.createEvent(entityDefnition, EventType.DELETE));
		return rows;
	}

	@Override
	public EntityDefnition disableEntity(String name,int version,String grpname) {
		EntityDefnition entityDefnition = new EntityDefnition();
		entityDefnition.setName(name);
		entityDefnition.setVersion(version);
		entityDefnition.setGroup(grpname);
		entityDefnition.setIsDisabled(true);
		EntityDefnition entityDefnitionUpdated = this.defnitionRepo.update(entityDefnition);
		this.notifyObservers(this.createEvent(entityDefnition, EventType.UPDATE));
		return entityDefnitionUpdated;
	}

	@Override
	public EntityDefnition enableEntity(String name,int version,String grpname) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public EntityDefnition fetchByName(String name, boolean loadDisabled) {
		EntityDefnition entityDefnition = new EntityDefnition();
		entityDefnition.setName(name);
		entityDefnition.setIsDisabled(false);
		EntityDefnition entityDefnitionUpdated = this.defnitionRepo.update(entityDefnition);
		this.notifyObservers(this.createEvent(entityDefnition, EventType.UPDATE));
		return entityDefnitionUpdated;
	}

	@Override
	public List<EntityDefnition> fetchAll(String name, boolean loadDisabled) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Page<EntityDefnition> fetchAll(String name, boolean loadDisabled, Pageable pageable) {
		// TODO Auto-generated method stub
		return null;
	}

	@PreDestroy
	private void destroy() {
		if (this.observers != null) {
			observers.clear();
		}
	}

	@Override
	public void register(IObserver<EntityDefnitionEvent> observer) {
		this.observers.add(observer);
	}

	@Override
	public void unregister(IObserver<EntityDefnitionEvent> observer) {
		this.observers.remove(observer);

	}

	@Override
	public void notifyObservers(EntityDefnitionEvent arg) {
		if (this.observers != null) {
			observers.forEach(observer -> observer.update(arg));
		}
	}

	private EntityDefnitionEvent createEvent(EntityDefnition entity, EventType type) {
		EntityDefnitionEvent arg = new EntityDefnitionEvent();
		arg.setEntity(entity);
		arg.setType(type);
		return arg;
	}

	@Override
	public List<EntityDefnition> disableEntity(String name) {
		return this.defnitionRepo.disableEntity(name);
		
	}
}
