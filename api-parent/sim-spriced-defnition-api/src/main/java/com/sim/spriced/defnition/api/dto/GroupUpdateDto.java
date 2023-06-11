package com.sim.spriced.defnition.api.dto;


import javax.validation.constraints.NotEmpty;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;


@Data
@Getter
@Setter
public class GroupUpdateDto {
	@NotEmpty
	private Integer id;
	@NotEmpty
	private String displayName;
}
