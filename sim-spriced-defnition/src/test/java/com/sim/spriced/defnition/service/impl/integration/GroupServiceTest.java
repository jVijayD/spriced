package com.sim.spriced.defnition.service.impl.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.stream.IntStream;

import org.jooq.exception.DataAccessException;
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
import com.sim.spriced.defnition.data.service.IGroupService;
import com.sim.spriced.framework.exceptions.data.NotFoundException;
import com.sim.spriced.framework.models.Group;

@SpringBootTest
@Import(MultitenantTestConfiguration.class)
@TestInstance(Lifecycle.PER_CLASS)
@TestMethodOrder(OrderAnnotation.class)
class GroupServiceTest {

	@Autowired
	IGroupService grpService;

	String grpName;

	@BeforeAll
	public void setup() {
		grpName = "groupTest";
	}

	@Test
	@Order(1)
	void createGroupTest() {
		Group grp = new Group(grpName);
		grp.setIsDisabled(false);
		Group newGrp = this.grpService.create(grp);
		assertEquals(grpName, newGrp.getName());
	}

	@Test
	@Order(2)
	void deleteByNameTest() {
		int row = this.grpService.deleteByName(grpName);
		assertEquals(1, row);
	}

	@Test
	@Order(3)
	void deleteByIdTest() {
		Group grp = new Group(grpName);
		grp.setIsDisabled(false);
		Group newGrp = this.grpService.create(grp);
		int row = this.grpService.delete(newGrp.getId());
		assertEquals(1, row);
	}

	@Test
	@Order(4)
	void fetchByNameTest() {
		Group grp = new Group(grpName);
		grp.setIsDisabled(false);
		Group newGrp = this.grpService.create(grp);
		assertNotNull(newGrp.getId());
		Group fetchedGrp = this.grpService.fetchByName(grpName, false);
		assertEquals(grpName, fetchedGrp.getName());
		this.grpService.deleteByName(grpName);
	}

	@Test
	@Order(5)
	void fetchAllTest() {
		IntStream.range(0, 2).forEach(item -> {
			Group grp = new Group(grpName + item);
			grp.setIsDisabled(false);
			this.grpService.create(grp);
		});

		List<Group> fetchedGrpList = this.grpService.fetchAll(false);
		assertEquals(2, fetchedGrpList.size());

		IntStream.range(0, 2).forEach(item -> this.grpService.deleteByName(grpName + item));
	}

	@Test
	@Order(6)
	void fetchAllPagableTest() {

		IntStream.range(0, 10).forEach(item -> {
			Group grp = new Group(grpName + item);
			grp.setIsDisabled(false);
			this.grpService.create(grp);
		});

		Pageable pagable = PageRequest.of(0, 5);
		Page<Group> page = this.grpService.fetchAll(false, pagable);
		assertEquals(5, page.getTotalElements());
		List<Group> groupList = page.getContent();
		assertEquals(5, groupList.size());

		IntStream.range(0, 10).forEach(item -> this.grpService.deleteByName(grpName + item));
	}

	@Test
	@Order(7)
	void fetchAllPagableSortedTest() {

		IntStream.range(0, 10).forEach(item -> {
			Group grp = new Group(grpName + item);
			grp.setIsDisabled(false);
			this.grpService.create(grp);
		});

		Pageable pagable = PageRequest.of(0, 5, Sort.by("name").descending());
		Page<Group> page = this.grpService.fetchAll(false, pagable);
		assertEquals(5, page.getTotalElements());
		List<Group> groupList = page.getContent();
		assertEquals(5, groupList.size());
		assertEquals(grpName + 9, groupList.get(0).getName());

		IntStream.range(0, 10).forEach(item -> this.grpService.deleteByName(grpName + item));
	}

	@Test
	@Order(8)
	void groupNameUniquenessTest() {

		DataAccessException exception = assertThrows(DataAccessException.class, () -> {
			IntStream.range(0, 2).forEach(item -> {
				Group grp = new Group(grpName);
				grp.setIsDisabled(false);
				this.grpService.create(grp);
			});
		});

		String expectedMessage = "duplicate key value violates unique constraint \"uk\"";
		String actualMessage = exception.getMessage();
		assertTrue(actualMessage.contains(expectedMessage));

		IntStream.range(0, 1).forEach(item -> this.grpService.deleteByName(grpName));
	}

	@Test
	@Order(8)
	void groupNotFoundTest() {

		Exception exception = assertThrows(NotFoundException.class, () -> {
			this.grpService.fetchByName("NotFound", false);
		});

		String expectedMessage = "Not Found";
		String actualMessage = exception.getMessage();
		assertTrue(actualMessage.contains(expectedMessage));

	}
}
