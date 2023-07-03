package com.sim.spriced.data.model;

import java.util.List;
import java.util.Map;

import org.json.JSONObject;

import com.sim.spriced.framework.rule.FactResult;

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
	private List<Map<String, Object>> result;
	private List<FactResult<JSONObject>> ruleValidations;
	// private final List<ValidationError> errors=new ArrayList<>();

//	public boolean hasError() {
//		return !this.errors.isEmpty();
//	}
//	
//	@Data
//	@AllArgsConstructor
//	public class ValidationError {
//		
//		private String code;
//		private String name;
//		
//		private String errorCode;
//		private String errorTitle;
//		private String message;
//	}
}
