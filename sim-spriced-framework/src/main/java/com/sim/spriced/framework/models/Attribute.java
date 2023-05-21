package com.sim.spriced.framework.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Attribute {
	private String name;
	private AttributeType type;
	
	public Attribute(String name) {
		this.name = name;
	}
}
