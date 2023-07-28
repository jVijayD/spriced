package com.sim.spriced.defnition.api.dto;

import java.sql.Timestamp;
import java.time.OffsetDateTime;
import java.util.List;

import com.sim.spriced.framework.models.Action.ActionGroup;
import com.sim.spriced.framework.models.Condition;
import com.sim.spriced.framework.models.ConditionalAction;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

//@Getter
//@Setter
//@Data
@NoArgsConstructor
@AllArgsConstructor
public class RuleDto {
	
	private Integer id;
	private Integer entityId;
	private Integer priority;
	private String name;
	private String description;
	private Boolean isExcluded;
	private String status;
	private String notification;
	private ActionGroup group;
	private List<Condition> condition;
	private ConditionalAction conditionalAction;
	private OffsetDateTime updatedDate;
	private String updatedBy;
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getEntityId() {
		return entityId;
	}
	public void setEntityId(Integer entityId) {
		this.entityId = entityId;
	}
	public Integer getPriority() {
		return priority;
	}
	public void setPriority(Integer priority) {
		this.priority = priority;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Boolean getIsExcluded() {
		return isExcluded;
	}
	public void setIsExcluded(Boolean isExcluded) {
		this.isExcluded = isExcluded;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getNotification() {
		return notification;
	}
	public void setNotification(String notification) {
		this.notification = notification;
	}
	public List<Condition> getCondition() {
		return condition;
	}
	public void setCondition(List<Condition> condition) {
		this.condition = condition;
	}
	public ConditionalAction getConditionalAction() {
		return conditionalAction;
	}
	public void setConditionalAction(ConditionalAction conditionalAction) {
		this.conditionalAction = conditionalAction;
	}
	public ActionGroup getGroup() {
		return group;
	}
	public void setGroup(ActionGroup group) {
		this.group = group;
	}
	public String getUpdatedBy() {
		return updatedBy;
	}
	public void setUpdatedBy(String updatedBy) {
		this.updatedBy = updatedBy;
	}
	public OffsetDateTime getUpdatedDate() {
		return updatedDate;
	}
	public void setUpdatedDate(OffsetDateTime updatedDate) {
		this.updatedDate = updatedDate;
	}
	
	
	
}
