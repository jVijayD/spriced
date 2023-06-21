package com.sim.spriced.data.api.dto.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.sim.spriced.data.api.dto.EntityDataResultDto;
import com.sim.spriced.data.model.EntityDataResult;

@Mapper(componentModel = "spring",unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EntityDataResultDtoMapper {
	EntityDataResultDto toEntityDataResultDto(EntityDataResult result);
	EntityDataResult toEntityDataResult(EntityDataResultDto data);
	List<EntityDataResultDto> toEntityDataResultDtoList(List<EntityDataResult> result);
}
