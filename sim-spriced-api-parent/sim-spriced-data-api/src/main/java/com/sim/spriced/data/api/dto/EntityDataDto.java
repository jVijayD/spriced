package com.sim.spriced.data.api.dto;

import java.util.List;

import javax.validation.constraints.NotEmpty;

import org.json.JSONObject;

import com.sim.spriced.framework.models.Attribute;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EntityDataDto {
	@NotEmpty
	private List<Object> values;
	private String entityName;
	private List<Attribute> attributes;
}
