package com.sim.spriced.framework.models;

import javax.persistence.Column;
import javax.persistence.Table;

import com.sim.spriced.framework.annotations.ExtraColumnData;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Table(name = "settings")
public class Settings extends BaseEntity {

	@ExtraColumnData(isPrimaryKey = true)
	@Column(name="user_id")
	private String userId;
	
	@Column(name = "settings")
	@ExtraColumnData(convertToJson = true, exclude = true)
	private SettingsData settingsData;
	
	public static class TableConstants {
		public static final String TABLE = "settings";
		public static final String USER_ID = "user_id";
		public static final String SETTINGS = "settings";
		public static final String ROW_PAGES="row_pages";		
		public static final String FREEZ_PAGES="freezPages";
		private TableConstants() {}
	}

	@Override
	boolean validate() {
		// TODO Auto-generated method stub
		return true;
	}
}
