package com.sim.spriced.data.api.dto;

import java.util.List;
import java.util.Map;

import org.json.JSONObject;

import com.sim.spriced.framework.rule.FactResult;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EntityDataResultDto {
	private int rowsChanged;
	private List<Map<String,Object>> result;
	private List<FactResult<JSONObject>> ruleValidations;
	//private final List<ValidationError> errors=new ArrayList<>();


}
