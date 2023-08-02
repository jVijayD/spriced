package com.sim.spriced.data.api.dto.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.sim.spriced.data.api.dto.FileDto;
import com.sim.spriced.framework.models.FileEntity;


@Mapper(componentModel = "spring",unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FileDtoMapper {

	FileDto toFileDto(FileEntity fileEntity);
	
	FileEntity toFileEntity(FileDto dto);
}
