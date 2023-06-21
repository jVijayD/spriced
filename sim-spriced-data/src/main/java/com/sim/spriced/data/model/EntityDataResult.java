package com.sim.spriced.data.model;

import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EntityDataResult {
	
	private int[] rowsChanged;
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
