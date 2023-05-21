package com.sim.spriced.defnition.repo.impl.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

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
import com.sim.spriced.defnition.repo.impl.EntityDefnitionRepo;
import com.sim.spriced.framework.models.EntityDefnition;

@SpringBootTest
@Import(MultitenantTestConfiguration.class)
@TestInstance(Lifecycle.PER_CLASS)
@TestMethodOrder(OrderAnnotation.class)
class EntityDefnitionRepoTest {

	@Autowired
	EntityDefnitionRepo entityRepo;

	String entityName;

	@BeforeAll
	public void setup() {
		entityName = "Entity1";
	}

	@Test
	@Order(1)
	void createTest() {
		EntityDefnition entity = new EntityDefnition(entityName);
		entity.setGroup("FirstGroup1");
		entity = this.entityRepo.create(entity);
		assertNotNull(entity.getVersion());
	}
	
	
	@Test
	@Order(2)
	void updateTest() {
		EntityDefnition entity = new EntityDefnition(entityName);
		entity.setGroup("FirstGroup1");
		entity.setIsDisabled(true);
		entity.setVersion(2);
		entity = this.entityRepo.update(entity);
		assertEquals(true,entity.getIsDisabled());
	}
	
	@Test
	@Order(3)
	void fetchOneTest() {
		EntityDefnition entity = new EntityDefnition(entityName);
		entity.setGroup("FirstGroup1");
		entity.setIsDisabled(true);
		entity.setVersion(2);
		EntityDefnition entityFetch = this.entityRepo.fetchOne(entity);
		assertNotNull(entityFetch);
	}
	
	@Test
	@Order(4)
	void fetchEntityByNameTest() {
		
		EntityDefnition entityFetch = this.entityRepo.fetchByName("Entity1","FirstGroup1");
		assertEquals(2,entityFetch.getVersion());
	}
	
	@Test
	@Order(5)
	void fetchAllTest() {
		EntityDefnition entity = new EntityDefnition(entityName);
		entity.setGroup("FirstGroup1");
		entity.setIsDisabled(true);
		entity.setVersion(2);
		List<EntityDefnition> entityFetch = this.entityRepo.fetchMultiple(entity,EntityDefnition.class);
		assertNotNull(entityFetch);
	}
	
	@Test
	@Order(6)
	void DeleteTest() {
		EntityDefnition entity = new EntityDefnition(entityName);
		entity.setGroup("FirstGroup1");
		entity.setIsDisabled(true);
		entity.setGroup("FirstGroup1");
		entity.setVersion(2);
		this.entityRepo.delete(entity);
		assertTrue(true);
	}

}
