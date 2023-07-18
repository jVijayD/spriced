package com.sim.spriced.defnition.data.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PreDestroy;

import com.sim.spriced.defnition.data.service.IEntityDataIngestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sim.spriced.defnition.data.repo.IEntityDefnitionRepo;
import com.sim.spriced.defnition.data.service.BaseService;
import com.sim.spriced.defnition.data.service.EntityDefnitionEvent;
import com.sim.spriced.defnition.data.service.IEntityDefnitionService;
import com.sim.spriced.framework.models.EntityDefnition;
import com.sim.spriced.framework.pubsub.EventType;
import com.sim.spriced.framework.pubsub.IObservable;
import com.sim.spriced.framework.pubsub.IObserver;

@Service
public class EntityDefnitionService  extends BaseService
		implements IEntityDefnitionService, IObservable<EntityDefnitionEvent> {

	private List<IObserver<EntityDefnitionEvent>> observers = new ArrayList<>();

	@Autowired
	IEntityDefnitionRepo defnitionRepo;

	@Autowired
	IEntityDataIngestionService entityDataIngestionService;

	EntityDefnitionService(List<IObserver<EntityDefnitionEvent>> entityDefnitionObservers) {
		entityDefnitionObservers.forEach(this::register);
	}

	@Override
	@Transactional
	public EntityDefnition create(EntityDefnition entityDefnition) {
		entityDefnition.validate();
		entityDefnition = this.defnitionRepo.add(entityDefnition);
		this.notifyObservers(this.createEvent(entityDefnition,null, EventType.ADD));
		this.entityDataIngestionService.insert(entityDefnition);
		return entityDefnition;
	}

	@Override
	@Transactional
	public int delete(String name,int groupId) {
		EntityDefnition entityDefnition = this.defnitionRepo.getByName(name, groupId);
		return this.delete(entityDefnition);
	}

	@Override
	@Transactional
	public int delete(EntityDefnition defnition) {
		int rows = this.defnitionRepo.remove(defnition);
		this.notifyObservers(this.createEvent(defnition,null, EventType.DELETE));
		this.entityDataIngestionService.deleteConnector(defnition);
		return rows;
	}
	
	@Override
	@Transactional
	@CachePut(value="entities",key="#entityDefnition.id")
	public EntityDefnition update(EntityDefnition entityDefnition) {
		entityDefnition.validate();
		EntityDefnition previous = this.defnitionRepo.get(entityDefnition.getId());
		entityDefnition = this.defnitionRepo.change(entityDefnition);
		
		this.notifyObservers(this.createEvent(entityDefnition,previous, EventType.UPDATE));
		return entityDefnition;
	}
	

	@Override
	public EntityDefnition disableEntity(String name,int groupId) {
		EntityDefnition entityDefnition = new EntityDefnition();
		entityDefnition.setName(name);
		entityDefnition.setGroupId(groupId);
		entityDefnition.setIsDisabled(true);
		return this.defnitionRepo.change(entityDefnition);
	}

	@Override
	public EntityDefnition enableEntity(String name,int groupId) {
		EntityDefnition entityDefnition = new EntityDefnition();
		entityDefnition.setName(name);
		entityDefnition.setGroupId(groupId);
		entityDefnition.setIsDisabled(false);
		return this.defnitionRepo.change(entityDefnition);
	}

	
	@Override
	public EntityDefnition fetchByName(String name, int groupId) {
		return this.defnitionRepo.getByName(name, groupId);
	}

	@Override
	public List<EntityDefnition> fetchAll(int groupId, boolean loadDisabled) {
		return this.defnitionRepo.getAll(groupId, loadDisabled);
	}

	@Override
	public List<EntityDefnition> fetchAll(int groupId) {
		return this.defnitionRepo.getAll(groupId, false);
	}

	@Override
	public Page<EntityDefnition> fetchAll(int groupId, boolean loadDisabled, Pageable pageable) {
		return this.defnitionRepo.getAll(groupId, loadDisabled, pageable);
	}

	@Override
	public Page<EntityDefnition> fetchAll(int groupId, Pageable pageable) {
		return this.defnitionRepo.getAll(groupId, true, pageable);
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


	private EntityDefnitionEvent createEvent(EntityDefnition entity,EntityDefnition previousEntity, EventType type) {
		EntityDefnitionEvent arg = new EntityDefnitionEvent();
		arg.setEntity(entity);
		arg.setPreviousEntity(previousEntity);
		arg.setType(type);
		return arg;
	}

	@Cacheable(value="entities",key="#id")
	@Override
	public EntityDefnition fetch(int id, boolean loadDisabled) {
		return this.defnitionRepo.get(id, loadDisabled);
	}

	@CacheEvict(value="entities",key="#id")
	@Transactional
	@Override
	public int delete(int id) {
		EntityDefnition defnition = this.defnitionRepo.get(id);
		return this.delete(defnition);
	}


}
