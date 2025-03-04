package com.sim.spriced.data.repo.impl;

import java.sql.Timestamp;
import java.time.OffsetDateTime;

import org.jooq.Record;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sim.spriced.data.repo.ISettingsRepo;
import com.sim.spriced.framework.constants.ModelConstants;
import com.sim.spriced.framework.models.Settings;
import com.sim.spriced.framework.models.SettingsData;
import com.sim.spriced.framework.repo.BaseRepo;


@Repository
public class SettingsRepo  extends BaseRepo implements ISettingsRepo {
	
	@Override
	public Settings addSettings(Settings data) {
		return super.create(data,this::convertToSettings);
	}

	@Override
	public void deleteSettings(Settings data) {
		super.delete(data);
	}

	@Override
	public Settings updateSettings(Settings data) {
		return super.update(data,this::convertToSettings);
	}

	@Override
	public Settings getSettings(Settings data) {
		return super.fetchOne(data,this::convertToSettings);
	}
	private Settings convertToSettings(Record rec) {
		Settings settings = new Settings();
		SettingsData settingsData =  super.convertJsonToObject(rec, SettingsData.class, Settings.TableConstants.TABLE, Settings.TableConstants.SETTINGS);
		settings.setUserId((String) rec.get(Settings.TableConstants.USER_ID));
		settings.setSettingsData(settingsData);
		settings.setUpdatedBy((String)rec.get(ModelConstants.UPDATED_BY));
		settings.setUpdatedDate((OffsetDateTime) rec.get(ModelConstants.UPDATED_DATE));
		return settings;
		
	}
}
