package com.sim.spriced.defnition.api.dto;

import java.sql.Timestamp;

import com.sim.spriced.framework.models.Action;
import com.sim.spriced.framework.models.Condition;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
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
	private Condition condition;
	private Action action;
	private Timestamp updatedDate;
	private String updatedBy;
}
