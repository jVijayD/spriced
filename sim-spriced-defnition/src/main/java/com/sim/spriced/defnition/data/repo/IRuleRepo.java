package com.sim.spriced.defnition.data.repo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.sim.spriced.framework.models.Rule;


public interface IRuleRepo {
	public Rule add(Rule rule);
	public int remove(Rule rule);
	public List<Rule> fetchAll();
	public Page<Rule> fetchAll(Pageable pagable);
	public Rule fetchByName(String name);
	public Rule fetch(Integer id);
	public Rule change(Rule rule);
}
