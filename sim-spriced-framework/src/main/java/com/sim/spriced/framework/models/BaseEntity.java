package com.sim.spriced.framework.models;

import java.sql.Timestamp;

import javax.persistence.Column;

import com.sim.spriced.framework.constants.ModelConstants;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class BaseEntity {
	@Column(name=ModelConstants.UPDATED_DATE)
	private Timestamp updatedDate;
	@Column(name=ModelConstants.UPDATED_BY)
	private String updatedBy;
}
