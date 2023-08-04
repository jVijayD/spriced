package com.sim.spriced.data.api.dto.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.sim.spriced.data.api.dto.BulkEntityDto;
import com.sim.spriced.framework.models.BulkEntityDetails;


@Mapper(componentModel = "spring",unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BulkEntityDtoMapper {

	BulkEntityDto toBulkEntityDto(BulkEntityDetails bulkEntityDetails);
	
	BulkEntityDetails toBulkEntityDetails(BulkEntityDto dto);
	
	List<BulkEntityDto> toFileDtoList(List<BulkEntityDetails> bulkEntityDetailsList );

}
