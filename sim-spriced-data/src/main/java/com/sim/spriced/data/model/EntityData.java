package com.sim.spriced.data.model;

import java.util.List;

import org.json.JSONObject;

import com.sim.spriced.framework.models.Attribute;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EntityData {
	private List<JSONObject> values; 
	private String entityName;
	private List<Attribute> attributes;
	private int entityId;
	
}
