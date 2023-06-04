package com.sim.spriced.framework.models;

import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Table(name="version")
public class Version {
	private Integer id;
	private Integer modelId;
	private String name;
	private String version;
	private String isCurrentVersion;
}
