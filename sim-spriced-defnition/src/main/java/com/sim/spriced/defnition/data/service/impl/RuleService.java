package com.sim.spriced.defnition.data.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.sim.spriced.defnition.data.repo.IRuleRepo;
import com.sim.spriced.defnition.data.service.IRuleService;
import com.sim.spriced.framework.models.Rule;
import com.sim.spriced.framework.models.StatusConstants;

@Service
public class RuleService implements IRuleService {

	@Autowired
	IRuleRepo ruleRepo;
	
	@Override
	public Rule create(Rule rule) {
		rule.validate();
		rule.setStatus(StatusConstants.ACTIVE);
		return this.ruleRepo.add(rule);
	}
	
	@Override
	public Rule save(Rule rule) {
		rule.setStatus(StatusConstants.IN_PROGRESS);
		return this.ruleRepo.save(rule);
	}

	@Override
	public Rule update(Rule rule) {
		rule.validate();
		if(rule.getIsExcluded()) {
			rule.setStatus(StatusConstants.EXCLUDED);
		} else {
			rule.setStatus(StatusConstants.ACTIVE);
		}
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
	
	//@Cacheable(value="rulesByEntity",key="#id")
	@Override
	public List<Rule> fetchByEntityId(int id) {
		return this.ruleRepo.fetchByEntityId(id);
	}

}
