package com.sim.spriced.data.repo;

import com.sim.spriced.framework.models.Settings;

public interface ISettingsRepo {

	
	public Settings addSettings(Settings  data);
	
	public void deleteSettings(Settings  data);
	
	public Settings updateSettings(Settings data);
	
	public Settings getSettings(Settings data);
}
