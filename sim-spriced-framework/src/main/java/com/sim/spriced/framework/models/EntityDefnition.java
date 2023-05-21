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
@Table(name="entity")
public class EntityDefnition extends BaseEntity {
	
	@ExtraColumnData(isPrimaryKey = true)
	@Column(name=ModelConstants.NAME)
	private String name;
	
	@ExtraColumnData(isPrimaryKey = true)
	@Column(name="group")
	private String group;
	
	@Column(name=ModelConstants.VERSION)
	@ExtraColumnData(isPrimaryKey = true,id = IDType.VERSION_SEQ)
	private Integer version;
	
	@Column(name=ModelConstants.IS_DISABLED)
	private Boolean isDisabled;
	
	@Column(name=ModelConstants.ATTRIBUTES)
	@ExtraColumnData(convertToJson = true,exclude=true)
	private final List<Attribute> attributes = new ArrayList<>();
	
	public EntityDefnition(String name){
		this.name = name;
		this.isDisabled = false;
	}
}
