package com.sim.spriced.defnition.api.dto;


import java.sql.Timestamp;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
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
}
