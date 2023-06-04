package com.sim.spriced.defnition.data.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sim.spriced.defnition.data.repo.impl.EntityCreationRepo;
import com.sim.spriced.defnition.data.service.BaseService;
import com.sim.spriced.defnition.data.service.EntityDefnitionEvent;
import com.sim.spriced.defnition.data.service.IEntityCreationService;
import com.sim.spriced.framework.models.Attribute;
import com.sim.spriced.framework.models.AttributeConstants.ConstraintType;
import com.sim.spriced.framework.models.EntityDefnition;
import com.sim.spriced.framework.pubsub.IObserver;

@Service
public class EntityCreationService extends BaseService implements IEntityCreationService, IObserver<EntityDefnitionEvent> {

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
			this.updateDefnition(entityDefnition, arg.getPreviousEntity());
			break;
		case DELETE:
			this.deleteDefnition(entityDefnition);
			break;
		default:
			throw new UnsupportedOperationException();
		}
	}

	@Override
	public EntityDefnition createDefnition(EntityDefnition entityDefnition) {
		this.creationRepo.create(entityDefnition);
		return entityDefnition;

	}

	@Override
	public EntityDefnition updateDefnition(EntityDefnition entityDefnition, EntityDefnition previousEntityDefnition) {
		// change table name
		if (!entityDefnition.getName().equalsIgnoreCase(previousEntityDefnition.getName())) {
			this.creationRepo.alterEntityName(previousEntityDefnition.getName(), entityDefnition.getName());
		}
		this.compareAttributesAndUpdate(entityDefnition, previousEntityDefnition);
		return entityDefnition;
	}

	@Override
	public void deleteDefnition(EntityDefnition entityDefnition) {
		this.creationRepo.delete(entityDefnition);
	}

	private void compareAttributesAndUpdate(EntityDefnition entityDefnition, EntityDefnition previousEntityDefnition) {

		List<Attribute> currentAttributes = entityDefnition.getAttributes();
		List<Attribute> prevAttributes = previousEntityDefnition.getAttributes();
		List<String> intersectingAttributes = new ArrayList<>();

		List<Attribute> addedAttributes = new ArrayList<>();
		List<String> deleteAttributes = new ArrayList<>();
		for (Attribute current : currentAttributes) {
			boolean add = true;
			for (Attribute previous : prevAttributes) {

				if (current.getId().equals(previous.getId())) {
					intersectingAttributes.add(current.getId());
					if (!current.getName().equals(previous.getName())) {
						// change of column name
						this.creationRepo.alterAttributeName(entityDefnition.getName(), previous.getName(), current.getName());
					}
					
					this.alterAttributeChanges(entityDefnition.getName(), current, previous);
					add = false;
					break;
				}
			}
			if (add) {
				addedAttributes.add(current);
			}
		}

		deleteAttributes.addAll(prevAttributes.stream().filter(item -> !intersectingAttributes.contains(item.getId()))
				.map(Attribute::getName).collect(Collectors.toList()));
		// add
		if(!addedAttributes.isEmpty()) {
			this.creationRepo.addAttributes(entityDefnition.getName(), addedAttributes);
		}
		
		// delete
		if(!deleteAttributes.isEmpty()) {
			this.creationRepo.deleteAttributes(entityDefnition.getName(), deleteAttributes);
		}
		
		this.alterConstraintChanges(entityDefnition, currentAttributes, prevAttributes);
		
	}
	
	
	private void alterConstraintChanges(EntityDefnition entityDefnition,List<Attribute> currentAttributes,List<Attribute> previousAttributes) {
		//Primary key
		List<Attribute> primaryKeysCurrent = currentAttributes.stream().filter(attr->attr.getConstraintType()==ConstraintType.PRIMARY_KEY).collect(Collectors.toList());
		List<Attribute> primaryKeysPrevious = previousAttributes.stream().filter(attr->attr.getConstraintType()==ConstraintType.PRIMARY_KEY).collect(Collectors.toList());
		
		boolean dropPrimaryKeys=this.dropConstraint(primaryKeysCurrent, primaryKeysPrevious);
		if(dropPrimaryKeys) {
			this.creationRepo.alterPrimaryKey(entityDefnition.getName(), primaryKeysCurrent);
		}
		
		//Composite Unique Key
		List<Attribute> compositeUniqueCurrent = currentAttributes.stream().filter(attr->attr.getConstraintType()==ConstraintType.COMPOSITE_UNIQUE_KEY).collect(Collectors.toList());
		List<Attribute> compositeUniquePrevious = previousAttributes.stream().filter(attr->attr.getConstraintType()==ConstraintType.COMPOSITE_UNIQUE_KEY).collect(Collectors.toList());
		
		boolean dropCompositeUniqueKeys=this.dropConstraint(compositeUniqueCurrent, compositeUniquePrevious);
		if(dropCompositeUniqueKeys) {
			this.creationRepo.alterCompositeUniqueKey(entityDefnition.getName(), compositeUniqueCurrent);
		}
		
		//Foreign key
		List<Attribute> foreignKeysCurrent = currentAttributes.stream().filter(attr->attr.getConstraintType()==ConstraintType.FOREIGN_KEY).collect(Collectors.toList());
		List<Attribute> foreignKeysPrevious = previousAttributes.stream().filter(attr->attr.getConstraintType()==ConstraintType.FOREIGN_KEY).collect(Collectors.toList());
		
		this.addDeleteContraints(entityDefnition.getName(),"fk_", foreignKeysCurrent, foreignKeysPrevious);
		
		//Unique key
		List<Attribute> uniqueKeysCurrent = currentAttributes.stream().filter(attr->attr.getConstraintType()==ConstraintType.UNIQUE_KEY).collect(Collectors.toList());
		List<Attribute> uniqueKeysPrevious = previousAttributes.stream().filter(attr->attr.getConstraintType()==ConstraintType.UNIQUE_KEY).collect(Collectors.toList());
		
		this.addDeleteContraints(entityDefnition.getName(),"uk_", uniqueKeysCurrent, uniqueKeysPrevious);
		
	}
	
	private void addDeleteContraints(String entityName,String constraintString,List<Attribute> currentAttributes,List<Attribute> prevAttributes) {
		List<String> intersectingAttributes = new ArrayList<>();

		List<Attribute> addedAttributes = new ArrayList<>();
		List<Attribute> deleteAttributes = new ArrayList<>();
		for (Attribute current : currentAttributes) {
			boolean add = true;
			for (Attribute previous : prevAttributes) {

				if (current.getId().equals(previous.getId())) {
					intersectingAttributes.add(current.getId());
					this.alterAttributeChanges(entityName, current, previous);
					add = false;
					break;
				}
			}
			if (add) {
				addedAttributes.add(current);
			}
		}

		deleteAttributes.addAll(prevAttributes.stream().filter(item -> !intersectingAttributes.contains(item.getId())).collect(Collectors.toList()));
		
//		// add
//		if(!addedAttributes.isEmpty()) {
//			this.creationRepo.addAttributes(entityDefnition.getName(), addedAttributes);
//		}
//		
//		// delete
//		if(!deleteAttributes.isEmpty()) {
//			this.creationRepo.deleteAttributes(entityDefnition.getName(), deleteAttributes);
//		}
	}
	
	
	/***
	 * If any of the constraints are different then drop it completely.
	 * @param currentAttributes
	 * @param previousAttributes
	 * @return
	 */
	private boolean dropConstraint(List<Attribute> currentAttributes,List<Attribute> previousAttributes) {
		boolean dropKeys=false;
		if(currentAttributes.size()!=previousAttributes.size()) {
			dropKeys = true;
		}
		else {
			for(Attribute attrCurrent:currentAttributes) {
				boolean identical = false;
				for(Attribute attrPrev:previousAttributes) {
					if(attrCurrent.getId().equals(attrPrev.getId())) {
						identical = true;
						break;
					}
				}
				if(!identical) {
					dropKeys = true;
					break;
				}
			}
		}
		
		return dropKeys;
	}
	
	private void alterAttributeChanges(String tableName,Attribute current,Attribute previous) {
		// Write logic to check the attribute changes
		if(current.getDefaultValue()!=previous.getDefaultValue()) {
			// Change default value
			this.creationRepo.alterAttributeDefaultValue(tableName, current.getName(), current.getDefaultValue());
		}
		
		if(current.getDataType()!=previous.getDataType()) {
			// Change in data type
			this.creationRepo.alterAttributeDataType(tableName, current);
		}
		
		if(current.getType()!=previous.getType()) {
			// Change in  type
		}
		
		// Write logic to check the constraints
		if(current.isNullable()!=previous.isNullable()) {
			// Drop or add Nullable
			this.creationRepo.alterAttributeNullable(tableName, current);
		}
		
	}
	


}
