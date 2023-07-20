package com.sim.spriced.data.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sim.spriced.data.repo.ISettingsRepo;
import com.sim.spriced.data.service.ISettingsService;
import com.sim.spriced.framework.context.SPricedContextManager;
import com.sim.spriced.framework.models.Settings;
import com.sim.spriced.framework.models.SettingsData;

@Service
public class SettingsService implements ISettingsService {

	@Autowired
	private ISettingsRepo settingsRepo;

	@Autowired
	protected SPricedContextManager contextManager;

	@Override
	public Settings addSettings(Settings settings) {

		settings.setUserId(this.contextManager.getRequestContext().getUser());
		return settingsRepo.addSettings(settings);
	}

	@Override
	public void deleteSettings() {
		Settings settings = new Settings();
		settings.setUserId(this.contextManager.getRequestContext().getUser());
		settingsRepo.deleteSettings(settings);
	}

	@Override
	public Settings updateSettings(Settings settings) {

		settings.setUserId(this.contextManager.getRequestContext().getUser());
		return settingsRepo.updateSettings(settings);

	}

	@Override
	public Settings getSettings() {
		Settings settings = new Settings();
		settings.setUserId(this.contextManager.getRequestContext().getUser());
		return settingsRepo.getSettings(settings);

	}
}
