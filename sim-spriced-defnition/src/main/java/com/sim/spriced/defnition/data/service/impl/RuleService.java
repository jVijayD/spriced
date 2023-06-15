package com.sim.spriced.defnition.data.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.sim.spriced.defnition.data.repo.IRuleRepo;
import com.sim.spriced.defnition.data.service.IRuleService;
import com.sim.spriced.framework.models.Rule;

@Service
public class RuleService implements IRuleService {

	@Autowired
	IRuleRepo ruleRepo;
	
	@Override
	public Rule create(Rule rule) {
		rule.validate();
		return this.ruleRepo.add(rule);
	}

	@Override
	public Rule update(Rule rule) {
		rule.validate();
		return this.ruleRepo.change(rule);
	}

	@Override
	public int deleteByName(String name) {
		Rule rule = new Rule();
		rule.setName(name);
		return this.ruleRepo.remove(rule);
	}

	@Override
	public int delete(int id) {
		Rule rule = new Rule(id);
		return this.ruleRepo.remove(rule);
	}

	@Override
	public Rule fetchByName(String name) {
		Rule rule = new Rule();
		rule.setName(name);
		return this.ruleRepo.fetch(rule);
	}

	@Override
	public Rule fetch(int id) {
		Rule rule = new Rule(id);
		return this.ruleRepo.fetch(rule);
	}

	@Override
	public List<Rule> fetchAll() {
		return this.ruleRepo.fetchAll();
	}

	@Override
	public Page<Rule> fetchAll(Pageable pageable) {
		return this.ruleRepo.fetchAll(pageable);
	}

}
