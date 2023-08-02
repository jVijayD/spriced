package com.sim.spriced.data.api.dto;

import java.time.OffsetDateTime;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class FileDto {


	private String entityName;
	 
	private String status;
	
	private String filePath;
	
	private String source;
	
	private OffsetDateTime updatedDate;
	
	private String updatedBy;
	
}
