package com.sim.spriced.data.api.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.sim.spriced.data.model.EntityDataResult.ValidationError;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EntityDataResultDto {
	private int rowsChanged;
	private Map<String,Object> result;
	private final List<ValidationError> errors=new ArrayList<>();


}
