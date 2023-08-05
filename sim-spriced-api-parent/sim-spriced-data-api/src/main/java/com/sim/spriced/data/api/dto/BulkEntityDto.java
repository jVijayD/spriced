package com.sim.spriced.data.api.dto;

import java.time.OffsetDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BulkEntityDto {

	public int id;
	
	public String entityName;
	 
	public String status;
	
	public String filePath;
	
	public String source;
	
	public OffsetDateTime updatedDate;
	
	public String updatedBy;
	
}
