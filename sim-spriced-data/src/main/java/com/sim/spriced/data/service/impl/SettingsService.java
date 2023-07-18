package com.sim.spriced.data.service.impl;

import java.sql.Timestamp;
import java.util.List;

import org.jooq.Record;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sim.spriced.data.repo.ISettingsRepo;
import com.sim.spriced.data.service.ISettingsService;
import com.sim.spriced.framework.constants.ModelConstants;
import com.sim.spriced.framework.context.SPricedContextManager;
import com.sim.spriced.framework.models.Action;
import com.sim.spriced.framework.models.Condition;
import com.sim.spriced.framework.models.ConditionalAction;
import com.sim.spriced.framework.models.Rule;
import com.sim.spriced.framework.models.Settings;
import com.sim.spriced.framework.models.SettingsData;

@Service
public class SettingsService implements ISettingsService {
	
	@Autowired
	private ISettingsRepo settingsRepo;
	
	@Autowired
	protected SPricedContextManager contextManager;
	

	String user;
	@Override
	public Settings addSettings(SettingsData settingsData) {
		// TODO Auto-generated method stub
		
		Settings settings = new Settings();
		settings. setSettingsData(settingsData);
		settings.setUserId(this.contextManager.getRequestContext().getUser());
		return settingsRepo.addSettings(settings);
	}

	@Override
	public void deleteSettings() {
		// TODO Auto-generated method stub
		Settings settings = new Settings();
		settings.setUserId(this.contextManager.getRequestContext().getUser());
		settingsRepo.deleteSettings(settings);
	}

	@Override
	public Settings updateSettings( SettingsData settingsData) {
		// TODO Auto-generated method stub
		
		Settings settings = new Settings();
		settings.setUserId(this.contextManager.getRequestContext().getUser());
		settings=settingsRepo.getSettings(settings);
		if(settings!=null) {
			settings.setSettingsData(settingsData);
		return settingsRepo.updateSettings(settings);
		}
		return null;
	}

	@Override
	public Settings getSettings() {
		Settings settings = new Settings();
		settings.setUserId(this.contextManager.getRequestContext().getUser());
		return settingsRepo.getSettings(settings);
		
	}
}
