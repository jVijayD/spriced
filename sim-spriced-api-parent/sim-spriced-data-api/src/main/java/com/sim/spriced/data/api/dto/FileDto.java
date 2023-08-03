package com.sim.spriced.data.api.dto;

import java.time.OffsetDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FileDto {


	private String entityName;
	 
	private String status;
	
	private String filePath;
	
	private String source;
	
	private OffsetDateTime updatedDate;
	
	private String updatedBy;
	
}
