package com.sim.spriced.framework.models;

import java.sql.Timestamp;

import javax.persistence.Column;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sim.spriced.framework.constants.ModelConstants;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public abstract class BaseEntity {
	@Column(name=ModelConstants.UPDATED_DATE)
	private Timestamp updatedDate;
	@Column(name=ModelConstants.UPDATED_BY)
	private String updatedBy;
	
	@Override
	public String toString() {
		ObjectMapper objectMapper = new ObjectMapper();
		String value = super.toString();
		try {
			value =  objectMapper.writeValueAsString(this);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		
		return value;
	}
	
	abstract boolean validate();
}
