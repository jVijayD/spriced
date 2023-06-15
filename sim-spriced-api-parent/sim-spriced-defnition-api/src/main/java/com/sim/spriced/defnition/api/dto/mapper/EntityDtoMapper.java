package com.sim.spriced.defnition.api.dto.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.sim.spriced.defnition.api.dto.EntityDto;
import com.sim.spriced.framework.models.EntityDefnition;

@Mapper(componentModel = "spring",unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EntityDtoMapper {
	EntityDto toEntityDto(EntityDefnition defnition);
	EntityDefnition toEntityDefnition(EntityDto entityDto);
}
