package com.sim.spriced.defnition.data.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.sim.spriced.framework.models.Rule;

public interface IRuleService {
	Rule create(Rule rule);
	Rule update(Rule rule);
	int deleteByName(String name);
	int delete(int id);
	Rule fetchByName(String name);
	Rule fetch(int id);
	List<Rule> fetchAll();
	Page<Rule> fetchAll(Pageable pageable);
}
