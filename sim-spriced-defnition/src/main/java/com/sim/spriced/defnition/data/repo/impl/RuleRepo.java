package com.sim.spriced.defnition.data.repo.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.sim.spriced.defnition.data.repo.IRuleRepo;
import com.sim.spriced.framework.models.Rule;
import com.sim.spriced.framework.repo.BaseRepo;

@Repository
public class RuleRepo extends BaseRepo implements IRuleRepo {

	private static final String TABLE = "rule";
	
	@Override
	public Rule add(Rule rule) {
		return super.create(rule);
	}

	@Override
	public int remove(Rule rule) {
		return super.delete(rule);
	}

	@Override
	public List<Rule> fetchAll() {
		return super.fetchAll(TABLE, null,Rule.class);
	}

	@Override
	public Page<Rule> fetchAll(Pageable pagable) {
		return super.fetchAll(TABLE, null,Rule.class,pagable);
	}

	@Override
	public Rule fetchByName(String name) {
		Rule rule = new Rule(name);
		return super.fetchOne(rule);
	}
	
	@Override
	public Rule fetch(Integer id) {
		Rule rule = new Rule(id);
		return super.fetchOne(rule);
	}

	@Override
	public Rule change(Rule rule) {
		return this.update(rule);
	}

}
