package com.sim.spriced.framework.models;

import javax.persistence.Column;
import javax.persistence.Table;

import com.sim.spriced.framework.annotations.ExtraColumnData;

import lombok.NoArgsConstructor;


@NoArgsConstructor
@Table(name = "settings")
public class Settings extends BaseEntity {

	
	@ExtraColumnData(isPrimaryKey = true)
	@Column(name="user_id")
	private String userId;
	
	@Column(name = "settings")
	@ExtraColumnData(convertToJson = true, exclude = true)
	private SettingsData settingsData;

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public SettingsData getSettingsData() {
		return settingsData;
	}

	public void setSettingsData(SettingsData settingsData) {
		this.settingsData = settingsData;
	}

	@Override
	boolean validate() {
		// TODO Auto-generated method stub
		return false;
	}
	
	public static class TableConstants {
		public static final String TABLE = "settings";
		public static final String USER_ID = "user_id";
		public static final String SETTINGS = "settings";
		public static final String ROW_PAGES="row_pages";		
		public static final String FREEZ_PAGES="freezPages";
		private TableConstants() {}
	}
}
