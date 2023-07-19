package com.sim.spriced.data.service;

import com.sim.spriced.framework.models.Settings;
import com.sim.spriced.framework.models.SettingsData;

public interface ISettingsService {

	
	public Settings addSettings(Settings settingsData);
	
	public void deleteSettings();
	
	public Settings updateSettings(Settings settingsData);
	
	public Settings getSettings();
}
