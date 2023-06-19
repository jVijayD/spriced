package com.sim.spriced.data.model;

import java.util.List;

import org.json.JSONArray;

import com.sim.spriced.framework.models.Attribute;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EntityData {
	private JSONArray values; 
	private String entityName;
	private List<Attribute> attributes;
	
}
