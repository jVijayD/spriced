package com.sim.spriced.data.api.dto.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.sim.spriced.data.api.dto.EntityDto;
import com.sim.spriced.framework.models.EntityDefnition;

@Mapper(componentModel = "spring",unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EntityDtoMapper {
	EntityDto toEntityDto(EntityDefnition defnition);
	EntityDefnition toEntityDefnition(EntityDto entityDto);
	List<EntityDto> toEntityDtoList(List<EntityDefnition> defnitions);
}
