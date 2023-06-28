package com.sim.spriced.defnition.repo.impl.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.sim.spriced.defnition.MultitenantTestConfiguration;
import com.sim.spriced.defnition.data.repo.IEntityDefnitionRepo;
import com.sim.spriced.defnition.data.repo.IGroupRepo;
import com.sim.spriced.defnition.data.repo.IRuleRepo;
import com.sim.spriced.framework.models.Condition;
import com.sim.spriced.framework.models.Condition.ConditionType;
import com.sim.spriced.framework.models.Condition.OperandType;
import com.sim.spriced.framework.models.Condition.OperatorType;
import com.sim.spriced.framework.models.Rule;

@SpringBootTest
@Import(MultitenantTestConfiguration.class)
@TestInstance(Lifecycle.PER_CLASS)
@TestMethodOrder(OrderAnnotation.class)
class RuleRepoTest {
	
	@Autowired
	IGroupRepo grpRepo;
	
	@Autowired
	IEntityDefnitionRepo defnitionRepo;
	
	@Autowired
	IRuleRepo ruleRepo;
	
	Integer id;
	@BeforeAll
	public void setup() {

		
		
	}
	
	@Order(1)
	@Test
	void createTest() {
//		Rule rule = new Rule("Rule Name");
//		rule.setEntityId(1);
//		rule.setPriority(1);
//		rule.setStatus("In Progress");
//		Condition condition = new Condition();
//		condition.setAttributeId("12345678");
//		condition.setConditionType(ConditionType.AND);
//		condition.setOperandType(OperandType.CONSTANT);
//		condition.setOperand("VALUE");
//		condition.setOperatorType(OperatorType.EQUALS);
//		
//		rule.setCondition(condition);
//		rule = this.ruleRepo.add(rule);
//		this.id=rule.getId();
//		assertNotNull(rule);
	}
	
	@Order(2)
	@Test
	void updateTest() {
		Rule rule = new Rule(this.id);
		rule.setPriority(10);
		rule.setStatus("Completed");
		rule = this.ruleRepo.change(rule);
		assertNotNull(rule);
	}
	
	@Order(3)
	@Test
	void getTest() {
		Rule rule = this.ruleRepo.fetch(this.id);
		assertNotNull(rule);
	}
	
	@Order(4)
	@Test
	void getByRuleTest() {
		Rule rule = new Rule(this.id);
		rule = this.ruleRepo.fetch(rule);
		assertNotNull(rule);
	}
	
	@Order(5)
	@Test
	void getAllTest() {
		List<Rule> rules = this.ruleRepo.fetchAll();
		assertTrue(rules.size()>1);
	}
	
	@Order(6)
	@Test
	void getAllPagableTest() {
		Pageable pagable = PageRequest.of(0, 10);
		Page<Rule> rules = this.ruleRepo.fetchAll(pagable);
		assertTrue(rules.getContent().size()>0);
	}
	
	
	@Order(8)
	@Test
	void deleteTest() {
		Rule rule = new Rule(this.id);
		int row = this.ruleRepo.remove(rule);
		assertEquals(1,row);
	}
	
	@AfterAll
	public void destroy() {
		
	}
	
}
