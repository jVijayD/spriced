package com.sim.spriced.defnition.repo.impl.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;
import java.util.stream.IntStream;

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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.sim.spriced.defnition.MultitenantTestConfiguration;
import com.sim.spriced.defnition.data.repo.IEntityDefnitionRepo;
import com.sim.spriced.defnition.data.repo.IGroupRepo;
import com.sim.spriced.framework.models.EntityDefnition;
import com.sim.spriced.framework.models.Group;

@SpringBootTest
@Import(MultitenantTestConfiguration.class)
@TestInstance(Lifecycle.PER_CLASS)
@TestMethodOrder(OrderAnnotation.class)
class EntityDefnitionRepoTest {

	@Autowired
	IEntityDefnitionRepo entityRepo;

	@Autowired
	IGroupRepo groupRepo;

	String entityName;
	Group grpEntity;

	@BeforeAll
	public void setup() {
		entityName = "test_entity";
		Group grp = new Group("test_entity_group");
		grp.setIsDisabled(false);
		grp.setDisplayName(entityName);
		grpEntity = this.groupRepo.add(grp);
	}

	@AfterAll
	public void destroy() {
		this.groupRepo.remove(this.grpEntity);
	}

	@Test
	@Order(1)
	void createEntityTest() {
		EntityDefnition entity = new EntityDefnition(entityName, grpEntity.getId());
		entity.setIsDisabled(false);
		entity.setDisplayName("test_entity_display");
		entity = this.entityRepo.add(entity);
		assertNotNull(entity);
	}

	@Test
	@Order(2)
	void updateEntityTest() {
		EntityDefnition entity = new EntityDefnition(entityName);
		entity = this.entityRepo.getByName(entityName, grpEntity.getId());
		entity.setIsDisabled(true);
		entity.setComment("Update for checks");
		entity = this.entityRepo.change(entity);
		assertEquals(true, entity.getIsDisabled());
		assertEquals("Update for checks", entity.getComment());
	}

	@Test
	@Order(3)
	void fetchByNameTest() {

		EntityDefnition entity = new EntityDefnition(entityName);
		entity.setIsDisabled(true);
		entity = this.entityRepo.getByName(entityName, grpEntity.getId(),true);
		assertNotNull(entity);
	}

	@Test
	@Order(4)
	void fetchByIdTest() {

		EntityDefnition entity = this.entityRepo.getByName(entityName, grpEntity.getId(),true);
		entity = this.entityRepo.get(entity.getId(),true);
		assertNotNull(entity);
	}

	@Test
	@Order(5)
	void deleteEntityTest() {
		EntityDefnition entity = new EntityDefnition(entityName, grpEntity.getId());
		int rows = this.entityRepo.remove(entity);
		assertEquals(1, rows);
	}

	@Test
	@Order(6)
	void fetchAllTest() {
		IntStream.range(0, 5).forEach(item -> {
			EntityDefnition entity = new EntityDefnition("Name" + item, grpEntity.getId());
			entity.setIsDisabled(false);
			entity.setDisplayName("test_entity_display");
			entity = this.entityRepo.add(entity);
		});
		List<EntityDefnition> entityList = this.entityRepo.getAll(grpEntity.getId(), false);
		assertEquals(5, entityList.size());

		IntStream.range(0, 5).forEach(item -> {
			EntityDefnition entity = new EntityDefnition("Name" + item, grpEntity.getId());
			entity.setIsDisabled(false);
			this.entityRepo.remove(entity);
		});
	}
	
	@Test
	@Order(7)
	void fetchAllPagableTest() {
		IntStream.range(0, 10).forEach(item -> {
			EntityDefnition entity = new EntityDefnition("Name" + item, grpEntity.getId());
			entity.setIsDisabled(false);
			entity.setDisplayName("test_entity_display");
			entity = this.entityRepo.add(entity);
		});
		Pageable pagable = PageRequest.of(0, 5, Sort.by("name").ascending());
		
		Page<EntityDefnition> pageEntityList = this.entityRepo.getAll(grpEntity.getId(),false, pagable);
		assertEquals(5, pageEntityList.getSize());
		assertEquals("Name4", pageEntityList.getContent().get(0).getName());
		IntStream.range(0, 10).forEach(item -> {
			EntityDefnition entity = new EntityDefnition("Name" + item, grpEntity.getId());
			entity.setIsDisabled(false);
			this.entityRepo.remove(entity);
		});
	}


}
