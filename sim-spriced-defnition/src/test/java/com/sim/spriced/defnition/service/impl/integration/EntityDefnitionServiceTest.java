package com.sim.spriced.defnition.service.impl.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestInstance.Lifecycle;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import com.sim.spriced.defnition.MultitenantTestConfiguration;
import com.sim.spriced.defnition.data.service.IEntityDefnitionService;
import com.sim.spriced.defnition.data.service.IGroupService;
import com.sim.spriced.framework.models.Attribute;
import com.sim.spriced.framework.models.AttributeConstants.ConstraintType;
import com.sim.spriced.framework.models.AttributeConstants.DataType;
import com.sim.spriced.framework.models.AttributeConstants.Type;
import com.sim.spriced.framework.models.EntityDefnition;
import com.sim.spriced.framework.models.Group;

@SpringBootTest
@Import(MultitenantTestConfiguration.class)
@TestInstance(Lifecycle.PER_CLASS)
@TestMethodOrder(OrderAnnotation.class)
class EntityDefnitionServiceTest {

	@Autowired
	IGroupService grpService;
	
	@Autowired
	IEntityDefnitionService entityService;

	String grpName;
	int grpId;
	String entityName;

	@BeforeAll
	public void setup() {
		grpName = "EntityDefnitionTestGrp";
		entityName = "EntityDefnitionTestEntity";
		Group grp = new Group(grpName);
		grp = grpService.create(grp);
		grpId = grp.getId();
	}
	
	@AfterAll
	public void destroy() {
		grpService.deleteByName(grpName);
	}
	
	@Test
	@Order(1)
	void createSimpleEntityDefnitionTest() {
		
		EntityDefnition defnition = new EntityDefnition(entityName,grpId);
		defnition.getAttributes().add(new Attribute("first_name", Type.FREE_FORM, DataType.STRING_VAR, 10));
		defnition.getAttributes().add(new Attribute("last_name", Type.FREE_FORM, DataType.STRING_VAR, 10));
		defnition.getAttributes().add(new Attribute("age", Type.FREE_FORM, DataType.INTEGER));
		
		defnition = this.entityService.create(defnition);
		assertEquals(entityName, defnition.getName());
		
		
		this.entityService.delete(entityName, grpId);
	
	}
	
	
	@Test
	@Order(2)
	void fetchDefnitionTest() {
		EntityDefnition defnition = new EntityDefnition(entityName,grpId);
		defnition.getAttributes().add(new Attribute("first_name", Type.FREE_FORM, DataType.STRING_VAR, 10));
		defnition.getAttributes().add(new Attribute("last_name", Type.FREE_FORM, DataType.STRING_VAR, 10));
		defnition.getAttributes().add(new Attribute("age", Type.FREE_FORM, DataType.INTEGER));
		
		defnition = this.entityService.create(defnition);
		defnition = this.entityService.fetchByName(entityName,grpId);
		assertNotNull(defnition);
		this.entityService.delete(entityName, grpId);
	}

	
	
	@Test
	@Order(3)
	void updateDefnitionAddAttributeTest() {
		
		EntityDefnition defnition = new EntityDefnition(entityName,grpId);
		defnition.getAttributes().add(new Attribute("first_name", Type.FREE_FORM, DataType.STRING_VAR, 10));
		defnition.getAttributes().add(new Attribute("last_name", Type.FREE_FORM, DataType.STRING_VAR, 10));
		defnition.getAttributes().add(new Attribute("age", Type.FREE_FORM, DataType.INTEGER));
		
		defnition = this.entityService.create(defnition);
		
		defnition = this.entityService.fetchByName( entityName,grpId);
		defnition.getAttributes().add(new Attribute("New1",Type.FREE_FORM,DataType.INTEGER));
		defnition.getAttributes().add(new Attribute("New2",Type.FREE_FORM,DataType.BOOLEAN));
		defnition = this.entityService.update(defnition);
		assertNotNull(defnition);
		this.entityService.delete(entityName, grpId);
	}
	
	
	@Test
	@Order(4)
	void createEntityDefnitionWithAutoPrimaryKeyTest() {
		EntityDefnition defnition = new EntityDefnition(entityName,grpId);
		Attribute primaryKey = new Attribute("id", Type.FREE_FORM, DataType.AUTO);
		primaryKey.setConstraintType(ConstraintType.PRIMARY_KEY);
		
		defnition.getAttributes().add(primaryKey);
		defnition.getAttributes().add(new Attribute("first_name", Type.FREE_FORM, DataType.STRING_VAR, 10));
		defnition.getAttributes().add(new Attribute("last_name", Type.FREE_FORM, DataType.STRING_VAR, 10));
		defnition.getAttributes().add(new Attribute("age", Type.FREE_FORM, DataType.INTEGER));
		
		defnition = this.entityService.create(defnition);
		assertEquals(entityName, defnition.getName());
		
		
		this.entityService.delete(entityName, grpId);
	
	}
	
	@Test
	@Order(5)
	void createEntityDefnitionWithStringPrimaryKeyTest() {
		EntityDefnition defnition = new EntityDefnition(entityName,grpId);
		Attribute primaryKey = new Attribute("id", Type.FREE_FORM, DataType.STRING_VAR,5);
		primaryKey.setConstraintType(ConstraintType.PRIMARY_KEY);
		
		defnition.getAttributes().add(primaryKey);
		
		Attribute uniqueKey = new Attribute("first_name", Type.FREE_FORM, DataType.STRING_VAR, 10);
		uniqueKey.setConstraintType(ConstraintType.UNIQUE_KEY);
		
		defnition.getAttributes().add(uniqueKey);
		defnition.getAttributes().add(new Attribute("last_name", Type.FREE_FORM, DataType.STRING_VAR, 10));
		defnition.getAttributes().add(new Attribute("age", Type.FREE_FORM, DataType.INTEGER));
		
		defnition = this.entityService.create(defnition);
		assertEquals(entityName, defnition.getName());
		
		this.entityService.delete(entityName, grpId);
	
	}
	
	@Test
	@Order(6)
	void createEntityDefnitionWithCodeAsPrimayAndStringDataTypeTest() {
		EntityDefnition defnition = new EntityDefnition(entityName,grpId);
		defnition.setAutoNumberCode(false);
		
		Attribute uniqueKey = new Attribute("first_name", Type.FREE_FORM, DataType.STRING_VAR, 10);
		uniqueKey.setConstraintType(ConstraintType.UNIQUE_KEY);
		
		defnition.getAttributes().add(uniqueKey);
		defnition.getAttributes().add(new Attribute("last_name", Type.FREE_FORM, DataType.STRING_VAR, 10));
		defnition.getAttributes().add(new Attribute("age", Type.FREE_FORM, DataType.INTEGER));
		
		defnition = this.entityService.create(defnition);
		assertEquals(entityName, defnition.getName());
		
		this.entityService.delete(entityName, grpId);
	
	}
	
	@Test
	@Order(7)
	void deleteTest() {
		EntityDefnition defnition = new EntityDefnition(entityName,grpId);
		defnition.setAutoNumberCode(false);
		
		Attribute uniqueKey = new Attribute("first_name", Type.FREE_FORM, DataType.STRING_VAR, 10);
		uniqueKey.setConstraintType(ConstraintType.UNIQUE_KEY);
		
		defnition.getAttributes().add(uniqueKey);
		defnition.getAttributes().add(new Attribute("last_name", Type.FREE_FORM, DataType.STRING_VAR, 10));
		defnition.getAttributes().add(new Attribute("age", Type.FREE_FORM, DataType.INTEGER));
		
		defnition = this.entityService.create(defnition);
		int rows = this.entityService.delete(entityName, grpId);
		assertEquals(1,rows);
	}
	
}
