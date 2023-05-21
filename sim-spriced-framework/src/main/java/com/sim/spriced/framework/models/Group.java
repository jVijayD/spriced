package com.sim.spriced.framework.models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Table;

import com.sim.spriced.framework.annotations.ExtraColumnData;
import com.sim.spriced.framework.constants.ModelConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Table(name="group")
public class Group extends BaseEntity {
	
	@ExtraColumnData(isPrimaryKey = true)
	@Column(name="Name")
	private String name;
	@Column(name=ModelConstants.IS_DISABLED)
	private Boolean isDisabled;
	private List<EntityDefnition> entities = new ArrayList<>();
	
	public Group(String name) {
		this.name = name;
	}
}
