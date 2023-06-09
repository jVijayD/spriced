package com.sim.spriced.defnition.api.dto;


import javax.validation.constraints.NotEmpty;

import lombok.Data;


@Data
public class GroupUpdateDto {
	@NotEmpty
	private Integer id;
	@NotEmpty
	private String displayName;
}
