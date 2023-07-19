package com.sim.spriced.data.api.dto.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.sim.spriced.data.api.dto.SettingsDto;
import com.sim.spriced.framework.models.Settings;


@Mapper(componentModel = "spring",unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SettingsDtoMapper {

	SettingsDto toSettingsDto(Settings settings);
	Settings toSettings(SettingsDto  settingsDto);
}
