package com.sim.spriced.defnition.api.dto;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.sim.spriced.framework.models.Attribute;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;


@NoArgsConstructor
@AllArgsConstructor
public class EntityDto {

	private Integer id;
	@NotEmpty
	private String name;
	private String displayName;
	@NotNull
	private Integer groupId;
	private Boolean isDisabled;
	private Boolean enableAuditTrial;
	private String comment;
	private final List<Attribute> attributes = new ArrayList<>();
	private Boolean autoNumberCode = true;
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
	public Integer getGroupId() {
		return groupId;
	}
	public void setGroupId(Integer groupId) {
		this.groupId = groupId;
	}
	public Boolean getIsDisabled() {
		return isDisabled;
	}
	public void setIsDisabled(Boolean isDisabled) {
		this.isDisabled = isDisabled;
	}
	public Boolean getEnableAuditTrial() {
		return enableAuditTrial;
	}
	public void setEnableAuditTrial(Boolean enableAuditTrial) {
		this.enableAuditTrial = enableAuditTrial;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public Boolean getAutoNumberCode() {
		return autoNumberCode;
	}
	public void setAutoNumberCode(Boolean autoNumberCode) {
		this.autoNumberCode = autoNumberCode;
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
	public List<Attribute> getAttributes() {
		return attributes;
	}
}
