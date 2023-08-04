package com.sim.spriced.defnition.data.repo;

import java.util.List;

import com.sim.spriced.framework.models.Attribute;
import com.sim.spriced.framework.models.AttributeConstants.DataType;
import com.sim.spriced.framework.models.EntityDefnition;

public interface IEntityCreationRepo {
	public int create(EntityDefnition entityDefnition);
	//public void update(EntityDefnition entityDefnition);
	public void delete(EntityDefnition entityDefnition);
	
	public void alterEntityName(String oldName,String newName);
	public void alterAttributeName(String entityName,String oldName,String newName);

	public void addAttributes(String entityName,List<Attribute> attributes);
	public void deleteAttributes(String entityName,List<String> attributes);
	
	public void alterAttributeDefaultValue(String entityName,String attributeName,Object defaultValue);
	public void alterAttributeDataType(String entityName,Attribute attribute);
	
	public void alterAttributeNullable(String entityName,Attribute attribute);
	
	public void alterPrimaryKey(String entityName,List<Attribute> attributes);
	public void alterCompositeUniqueKey(String entityName, List<Attribute> attributes);
	
	public void alterForeignKey(String entityName, List<Attribute> addedAttributes,
			List<Attribute> deletedAttributes);
	public void alterUniqueKey(String entityName, List<Attribute> addedAttributes,
			List<Attribute> deletedAttributes);
	public void createTrigger(String entityName);
	public void dropTrigger(String entityName);
}
