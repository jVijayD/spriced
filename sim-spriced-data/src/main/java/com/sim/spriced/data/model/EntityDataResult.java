package com.sim.spriced.data.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EntityDataResult {
	
	private int[] rowsChanged;
	private Map<String,Object> result;
	private final List<ValidationError> errors=new ArrayList<>();
	
	
	public boolean hasError() {
		return !this.errors.isEmpty();
	}
	
	@Data
	@AllArgsConstructor
	public class ValidationError {
		
		private String code;
		private String name;
		
		private String errorCode;
		private String errorTitle;
		private String message;
	}
}
