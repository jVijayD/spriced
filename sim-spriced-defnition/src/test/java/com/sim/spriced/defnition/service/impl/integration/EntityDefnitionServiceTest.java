package com.sim.spriced.defnition.service.impl.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;

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

//	@Autowired
//	IGroupService grpService;
//	
//	@Autowired
//	IEntityDefnitionService entityService;
//
//	String grpName;
//	String entityName;
//
//	@BeforeAll
//	public void setup() {
//		grpName = "EntityDefnitionTestGrp";
//		entityName = "EntityDefnitionTestEntity";
//		Group grp = new Group(grpName);
//		grpService.create(grp);
//	}
//	
//	@AfterAll
//	public void destroy() {
//		//grpService.delete(grpName);
//	}
//	
//	@Test
//	@Order(1)
//	void createTest() {
//		
//		EntityDefnition defnition = new EntityDefnition(entityName,grpName);
//		
//		Attribute varString = new Attribute("col6",Type.FREE_FORM ,DataType.STRING);
//		varString.setNullable(false);
//		varString.setSize(50);
//		
//		List<Attribute> attributes = defnition.getAttributes();
//		Attribute codeAttr = new Attribute("code",Type.FREE_FORM,DataType.BUSINESS_SEQUENCE);
//		codeAttr.setConstraintType(ConstraintType.PRIMARY_KEY);
//		codeAttr.setBusinessIdAppender("BID");
//		attributes.add(codeAttr);
//
//		attributes.add(new Attribute("col1",Type.FREE_FORM,DataType.INTEGER));
//		attributes.add(new Attribute("col2",Type.FREE_FORM,DataType.DOUBLE));
//		attributes.add(new Attribute("col3",Type.FREE_FORM,DataType.BOOLEAN));
//		attributes.add(new Attribute("col4",Type.FREE_FORM,DataType.CHARACTER));
//		attributes.add(new Attribute("col5",Type.FREE_FORM,DataType.STRING_VAR));
//		attributes.add(new Attribute("col7",Type.FREE_FORM,DataType.INTEGER));
//		attributes.add(varString);
//		
//		defnition = this.entityService.create(defnition);
//		assertEquals(entityName, defnition.getName());
//	}
//	
//	
//	@Test
//	@Order(2)
//	void fetchDefnitionTest() {
//		EntityDefnition defnition = this.entityService.fetchByName(entityName,grpName, false);
//		assertNotNull(defnition);
//	}
//
//	
//	
//	//@Test
//	@Order(4)
//	void updateDefnitionAddAttributeTest() {
//		EntityDefnition defnition = this.entityService.fetchByName( entityName,grpName, false);
//		defnition.getAttributes().add(new Attribute("New1",Type.FREE_FORM,DataType.INTEGER));
//		defnition.getAttributes().add(new Attribute("New2",Type.FREE_FORM,DataType.BOOLEAN));
//		defnition = this.entityService.update(defnition);
//		assertNotNull(defnition);
//
//	}
//	
//	//@Test
//	@Order(5)
//	void deleteTest() {
//		int rows = this.entityService.delete(entityName,1,grpName);
//		assertEquals(1,rows);
//	}
	
}
