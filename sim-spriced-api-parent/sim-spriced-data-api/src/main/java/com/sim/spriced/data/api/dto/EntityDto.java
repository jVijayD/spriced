package com.sim.spriced.data.api.dto;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.sim.spriced.framework.models.Attribute;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
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
	private OffsetDateTime updatedDate;
	private String updatedBy;
	
}
