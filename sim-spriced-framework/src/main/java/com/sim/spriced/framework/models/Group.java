package com.sim.spriced.framework.models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Table;

import com.sim.spriced.framework.annotations.ExtraColumnData;
import com.sim.spriced.framework.annotations.IDType;
import com.sim.spriced.framework.constants.ModelConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Table(name="group")
public class Group extends BaseEntity {
	
	@ExtraColumnData(isPrimaryKey = true,id=IDType.AUTO)
	@Column(name="id")
	private Integer id;

	@Column(name="name")
	private String name;
	
	@Column(name="display_name")
	private String displayName;
	
	@Column(name=ModelConstants.IS_DISABLED)
	private Boolean isDisabled;
	
	//TO DO - Need to implement One to Many.
	private List<EntityDefnition> entities = new ArrayList<>();
	
	public Group(String name) {
		this.name = name;
	}

	@Override
	public boolean validate() {
		this.setDefaultValues();
		return true;
	}
	
	private void setDefaultValues() {
		if(this.displayName==null) {
			this.displayName = this.name;
		}
	}
}
