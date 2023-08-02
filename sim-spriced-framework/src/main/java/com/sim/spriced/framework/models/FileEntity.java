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
@Table(name="filedetails")
public class FileEntity extends BaseEntity {

	@ExtraColumnData(isPrimaryKey = true,id=IDType.AUTO)
	@Column(name="id")
	private Integer id;

	@Column(name="path")
	private String filePath;
	
	@Column(name="status")
	private String status;
	
	@Column(name="source")
	private String source;
	
	@Column(name="entity_name")
	private String entityName;
	

	@Override
	boolean validate() {
		// TODO Auto-generated method stub
		return true;
	}

	
	
}
