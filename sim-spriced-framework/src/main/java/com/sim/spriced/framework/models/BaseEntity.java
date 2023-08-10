package com.sim.spriced.framework.models;

import java.time.OffsetDateTime;

import javax.persistence.Column;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.sim.spriced.framework.constants.ModelConstants;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public abstract class BaseEntity {
	@Column(name=ModelConstants.UPDATED_DATE)
	private OffsetDateTime updatedDate;
	@Column(name=ModelConstants.UPDATED_BY)
	private String updatedBy;
	
	@Override
	public String toString() {
		String value = super.toString();
		ObjectMapper objectMapper = new ObjectMapper();
	    objectMapper.registerModule(new JavaTimeModule());
		
		try {
			value =  objectMapper.writeValueAsString(this);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		
		return value;
	}
	
	abstract boolean validate();
}
