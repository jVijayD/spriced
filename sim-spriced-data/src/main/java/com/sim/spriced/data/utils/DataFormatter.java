package com.sim.spriced.data.utils;

import java.sql.Date;
import java.sql.Timestamp;

public class DataFormatter {
	public Timestamp stringToTimeStamp(String timeStamp) {
		return Timestamp.valueOf(timeStamp);
	}
	
	public Date stringToDate(String timeStamp) {
		return Date.valueOf(timeStamp);
	}
}
