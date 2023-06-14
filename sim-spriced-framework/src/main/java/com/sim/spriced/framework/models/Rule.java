package com.sim.spriced.framework.models;

import javax.persistence.Column;
import javax.persistence.Table;

import com.sim.spriced.framework.annotations.ExtraColumnData;
import com.sim.spriced.framework.annotations.IDType;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Table(name="rule")
public class Rule extends BaseEntity {
	
	@ExtraColumnData(isPrimaryKey = true,id=IDType.AUTO)
	@Column(name="id")
	private Integer id;
	
//	@Column(name="model_id")
//	private Integer modelId;
	
	@Column(name="entity_id")
	private Integer entityId;
	
	@Column(name="priority")
	private Integer priority;
	
	@Column(name="name")
	private String name;
	
	@Column(name="description")
	private String description;
	
	@Column(name="is_excluded")
	private Boolean isExcluded;
	
	@Column(name="status")
	private String status;
	
	@Column(name="notification")
	private String notification;
	
//	@Column(name="version")
//	private Integer version;
	
	@Column(name="condition")
	@ExtraColumnData(convertToJson = true, exclude = true)
	private Condition condition;
	
	@Column(name="action")
	@ExtraColumnData(convertToJson = true, exclude = true)
	private Action action;

	public Rule(String name) {
		this.name = name;
	}
	
	public Rule(Integer id) {
		this.id = id;
	}
	
	public Rule(Integer id,String name) {
		this.id = id;
		this.name = name;
	}
	
	@Override
	boolean validate() {
		return true;
	}

}
