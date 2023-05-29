package com.sim.spriced.defnition.service.impl.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;

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
import com.sim.spriced.defnition.data.service.IGroupService;
import com.sim.spriced.framework.models.Group;

@SpringBootTest
@Import(MultitenantTestConfiguration.class)
//@TestInstance(Lifecycle.PER_CLASS)
@TestMethodOrder(OrderAnnotation.class)
class GroupServiceTest {
	
	@Autowired
	IGroupService grpService;

	String grpName;

	@BeforeAll
	public void setup() {
		grpName = "FirstGroup2";
	}
	
	
	@Test
	@Order(1)
	void createTest() {
		Group grp = new Group(grpName);
		grp.setIsDisabled(false);
		Group newGrp = this.grpService.create(grp);
		assertEquals(grpName, newGrp.getName());
	}

	@Test
	@Order(2)
	void deleteTest() {

		int row = this.grpService.delete(grpName);
		assertEquals(1, row);
	}
}
