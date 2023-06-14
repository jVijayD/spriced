package com.sim.spriced.defnition.repo.impl.integration;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance.Lifecycle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import com.sim.spriced.defnition.MultitenantTestConfiguration;
import com.sim.spriced.defnition.data.repo.IEntityDefnitionRepo;
import com.sim.spriced.defnition.data.repo.IGroupRepo;
import com.sim.spriced.defnition.data.repo.IRuleRepo;
import com.sim.spriced.defnition.data.repo.impl.EntityDefnitionRepo;
import com.sim.spriced.defnition.data.repo.impl.GroupRepo;
import com.sim.spriced.framework.models.Group;
import com.sim.spriced.framework.models.Rule;

@SpringBootTest
@Import(MultitenantTestConfiguration.class)
@TestInstance(Lifecycle.PER_CLASS)
@TestMethodOrder(OrderAnnotation.class)
public class RuleRepoTest {
	
	@Autowired
	IGroupRepo grpRepo;
	
	@Autowired
	IEntityDefnitionRepo defnitionRepo;
	
	@Autowired
	IRuleRepo ruleRepo;
	
	@BeforeAll
	public void setup() {
//		Group grp = new Group();
//		grp.setName("Group1");
//		grp.setDisplayName("Group1 Display Name");
//		grp.setIsDisabled(false);
//		grp = this.grpRepo.add(grp);
		
		
	}
	
	@Test
	void createTest() {
		Rule rule = new Rule("Rule Name");
		rule.setEntityId(1);
		rule.setPriority(1);
		rule.setStatus("In Progress");
		rule = this.ruleRepo.add(rule);
		assertNotNull(rule);
	}
	
	
	@Test
	void updateTest() {
		Rule rule = new Rule(1,"Rule Name");
		rule.setPriority(10);
		rule.setStatus("Completed");
		rule = this.ruleRepo.change(rule);
		assertNotNull(rule);
	}
	
//	@Test
//	void deleteTest() {
//		Rule rule = new Rule("Rule Name");
//		rule.setEntityId(1);
//		rule.setPriority(1);
//		rule.setStatus("In Progress");
//		rule = this.ruleRepo.add(rule);
//		assertNotNull(rule);
//	}
	
	@AfterAll
	public void destroy() {
		
	}
	
}
