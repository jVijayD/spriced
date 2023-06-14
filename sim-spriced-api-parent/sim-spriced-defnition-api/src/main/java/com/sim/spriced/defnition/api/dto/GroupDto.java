package com.sim.spriced.defnition.api.dto;


import java.sql.Timestamp;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class GroupDto {
	private Integer id;
	@NotEmpty
	@Size(min=3,max=25,message="name should have minimum of 3 and maximum of 25 characters")
	private String name;
	private String displayName;
	private Boolean isDisabled;
	private Timestamp updatedDate;
	private String updatedBy;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDisplayName() {
		return displayName;
	}
	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}
	public Boolean getIsDisabled() {
		return isDisabled;
	}
	public void setIsDisabled(Boolean isDisabled) {
		this.isDisabled = isDisabled;
	}
	public Timestamp getUpdatedDate() {
		return updatedDate;
	}
	public void setUpdatedDate(Timestamp updatedDate) {
		this.updatedDate = updatedDate;
	}
	public String getUpdatedBy() {
		return updatedBy;
	}
	public void setUpdatedBy(String updatedBy) {
		this.updatedBy = updatedBy;
	}
	
}
