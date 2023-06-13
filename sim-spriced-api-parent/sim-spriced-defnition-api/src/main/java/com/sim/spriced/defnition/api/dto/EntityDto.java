package com.sim.spriced.defnition.api.dto;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.sim.spriced.framework.models.Attribute;

import lombok.Data;

@Data
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
}
