package com.sim.spriced.defnition.repo.impl.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.sim.spriced.defnition.MultitenantTestConfiguration;
import com.sim.spriced.defnition.data.repo.impl.GroupRepo;
import com.sim.spriced.framework.exceptions.data.NotFoundException;
import com.sim.spriced.framework.models.Group;

@SpringBootTest
@Import(MultitenantTestConfiguration.class)
@TestInstance(Lifecycle.PER_CLASS)
@TestMethodOrder(OrderAnnotation.class)
class GroupRepoTest {

	@Autowired
	GroupRepo grpRepo;

	String grpName;

	@BeforeAll
	public void setup() {
		grpName = "FirstGroup1";
	}

	@Test
	@Order(1)
	void createTest() {
		Group grp = new Group(grpName);
		grp.setDisplayName(grpName);
		grp.setIsDisabled(false);
		Group newGrp = this.grpRepo.add(grp);
		assertEquals(grpName, newGrp.getName());
	}

	@Test
	@Order(2)
	void updateTest() {

	
		Group grp = this.grpRepo.fetchByName(grpName);
		grp.setIsDisabled(true);
		Group newGrp = this.grpRepo.update(grp);
		assertEquals(grpName, newGrp.getName());
		assertEquals(true, newGrp.getIsDisabled());
	}
	
	@Test
	@Order(3)
	void fetchByNameTest() {
		Group grp = this.grpRepo.fetchByName(grpName);
		assertEquals(grpName, grp.getName());
	}
	
	@Test
	@Order(4)
	void fetchByInvalidNameTest() {
		Exception exception = assertThrows(NotFoundException.class, ()->{
			this.grpRepo.fetchByName("invalidName");
		});
		
		String expectedMessage = "Not Found";
		String actualMessage = exception.getMessage();
		assertTrue(actualMessage.contains(expectedMessage));
	}
	
	@Test
	@Order(5)
	void fetchByMultipleConditionTest() {
		Group grp = new Group(grpName);
		grp.setIsDisabled(true);
		grp = this.grpRepo.fetchOne(grp);
		assertEquals(true,grp.getIsDisabled());
	}
	
	
	@Test
	@Order(6)
	void fetchByMultipleRowsTest() {
		Group grp = new Group(grpName);
		grp.setIsDisabled(true);
		List<Group> grpList = this.grpRepo.fetchMultiple(grp,Group.class);
		assertEquals(1,grpList.size());
	}
	
	@Test
	@Order(7)
	void fetchAllPagableWithoutSortTest() {
		Group grp = new Group(grpName);
		grp.setIsDisabled(true);
		Pageable pagable = PageRequest.of(0, 10);
		Page<Group> grpList = this.grpRepo.fetchAll(grp,Group.class,pagable);
		assertEquals(1,grpList.getTotalElements());
		assertEquals(grpName,grpList.getContent().get(0).getName());
	}
	
	@Test
	@Order(8)
	void fetchAllPagableWitSortTest() {
		Group grp = new Group(grpName);
		grp.setIsDisabled(true);
		Pageable pagable = PageRequest.of(0,10,Sort.by("name").ascending());
		Page<Group> grpList = this.grpRepo.fetchAll(grp,Group.class,pagable);
		assertEquals(1,grpList.getTotalElements());
		assertEquals(grpName,grpList.getContent().get(0).getName());
	}
		
	@Test
	@Order(9)
	void deleteTest() {
		Group grp = new Group();
		grp.setName(grpName);
		grp.setIsDisabled(null);
		int rows = this.grpRepo.delete(grp);
		assertEquals(1, rows);
	}

}
