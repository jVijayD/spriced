package com.sim.spriced.defnition.api.dto.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.sim.spriced.defnition.api.dto.RuleDto;
import com.sim.spriced.framework.models.Rule;

@Mapper(componentModel = "spring",unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RuleDtoMapper {
	RuleDto toRuleDto(Rule rule);
	Rule toRule(RuleDto ruleDto);
	List<RuleDto> toRuleDtoList(List<Rule> ruleList);
}