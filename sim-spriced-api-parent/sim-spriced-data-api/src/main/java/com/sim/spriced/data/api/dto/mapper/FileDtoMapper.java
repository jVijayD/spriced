package com.sim.spriced.data.api.dto.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.sim.spriced.data.api.dto.FileDto;
import com.sim.spriced.framework.models.BulkEntityDetails;


@Mapper(componentModel = "spring",unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FileDtoMapper {

	FileDto toFileDto(BulkEntityDetails fileEntity);
	
	BulkEntityDetails toBulkEntityDetails(FileDto dto);
}
