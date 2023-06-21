package com.sim.spriced.data.api.dto;

import java.util.ArrayList;
import java.util.List;

import com.sim.spriced.data.model.EntityDataResult.ValidationError;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EntityDataResultDto {
	private int[] rowsChanged;
	private final List<ValidationError> errors=new ArrayList<>();
	
	
	public boolean hasError() {
		return !this.errors.isEmpty();
	}
	
}
