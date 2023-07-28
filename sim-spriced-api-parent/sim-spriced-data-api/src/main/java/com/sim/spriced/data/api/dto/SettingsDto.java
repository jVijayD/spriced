package com.sim.spriced.data.api.dto;

import java.time.OffsetDateTime;

import com.sim.spriced.framework.models.SettingsData;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SettingsDto {
	
	private String userId;

	private SettingsData settingsData;

	private OffsetDateTime updatedDate;

	private String updatedBy;
}
