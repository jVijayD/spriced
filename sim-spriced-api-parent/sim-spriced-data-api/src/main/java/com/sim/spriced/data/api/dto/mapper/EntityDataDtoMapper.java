package com.sim.spriced.data.api.dto.mapper;

import java.util.List;
import java.util.Map;

import org.json.JSONObject;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import com.sim.spriced.data.api.dto.EntityDataDto;
import com.sim.spriced.data.model.EntityData;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EntityDataDtoMapper {
	EntityDataDto toEntityDataDto(EntityData data);

	@Mapping(source = "values", target = "values", qualifiedByName = "convertValuesToJson")
	EntityData toEntityData(EntityDataDto data);

	@SuppressWarnings("unchecked")
	@Named("convertValuesToJson")
	public static List<JSONObject> convertValuesToJson(List<Object> values) {
		return values.stream().map(item ->  new JSONObject((Map<String,?>)item)).toList();
	}
}
