package com.sim.spriced.defnition.api.controllers;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sim.spriced.defnition.api.dto.RuleDto;
import com.sim.spriced.defnition.api.dto.mapper.RuleDtoMapper;
import com.sim.spriced.defnition.data.service.IRuleService;
import com.sim.spriced.framework.models.Rule;

import io.micrometer.core.annotation.Timed;

@RestController()
@RequestMapping("")
@CrossOrigin(origins = "*")
public class RuleController {
	
	@Autowired
	IRuleService ruleService;
	
	@Autowired
	RuleDtoMapper mapper;
	
	
	@Timed(value = "rule.getAll.time", description = "Time taken to return rules.")
	@GetMapping("/rules")
	public ResponseEntity<List<RuleDto>> get() {
		return new ResponseEntity<>(mapper.toRuleDtoList(this.ruleService.fetchAll()), HttpStatus.OK);
	}
	
	@Timed(value = "rule.getAll.time", description = "Time taken to return rules based on entityId.")
	@GetMapping("/entities/{id}/rules")
	public ResponseEntity<List<RuleDto>> getRuleByEntityId(@PathVariable int id) {
		return new ResponseEntity<>(mapper.toRuleDtoList(this.ruleService.fetchByEntityId(id)), HttpStatus.OK);
	}
	
	@Timed(value = "rule.get.time", description = "Time taken to return rule.")
	@GetMapping("/rules/{id}")
	public ResponseEntity<RuleDto> get(@PathVariable int id) {
		return new ResponseEntity<>(mapper.toRuleDto(this.ruleService.fetch(id)), HttpStatus.OK);
	}
	
	@Timed(value = "rule.create.time", description = "Time taken to create rule.")
	@PostMapping("/rules")
	public ResponseEntity<RuleDto> create(@Valid @RequestBody RuleDto rule) {
		Rule rul = mapper.toRule(rule);
		rul = this.ruleService.create(rul);
		return new ResponseEntity<>(mapper.toRuleDto(rul), HttpStatus.CREATED);
	}
	
	
	@Timed(value = "rule.update.time", description = "Time taken to update rule.")
	@PutMapping("/rules/{id}")
	public ResponseEntity<RuleDto> update(@PathVariable int id,@Valid @RequestBody RuleDto rule) {
		Rule rul = mapper.toRule(rule);
		rul = this.ruleService.update(rul);
		return new ResponseEntity<>(mapper.toRuleDto(rul), HttpStatus.CREATED);
	}
	
	
	@Timed(value = "rule.delete.time", description = "Time taken to delete rule.")
	@DeleteMapping("/rules/{id}")
	public ResponseEntity<Integer> remove(@PathVariable int id) {
		return new ResponseEntity<>(this.ruleService.delete(id), HttpStatus.OK);
	}
	
	@Timed(value = "rule.create.time", description = "Time taken to create rule.")
	@PostMapping("/rules/save")
	public ResponseEntity<RuleDto> save(@RequestBody RuleDto rule) {
		Rule rul = mapper.toRule(rule);
		rul = this.ruleService.save(rul);
		return new ResponseEntity<>(mapper.toRuleDto(rul), HttpStatus.CREATED);
	}
}
