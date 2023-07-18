package com.sim.spriced.data.service;

import com.sim.spriced.framework.models.Settings;
import com.sim.spriced.framework.models.SettingsData;

public interface ISettingsService {

	
	public Settings addSettings(SettingsData settingsData);
	
	public void deleteSettings();
	
	public Settings updateSettings(SettingsData settingsData);
	
	public Settings getSettings();
}
