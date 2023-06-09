package com.sim.spriced.defnition.api.dto;

import java.util.UUID;

import com.sim.spriced.framework.models.AttributeConstants.DataType;
import com.sim.spriced.framework.models.AttributeConstants.Type;

import lombok.Data;

@Data
public class Attribute {
	private String id= UUID.randomUUID().toString();
	private String name;
	private DataType dataType=DataType.STRING;
	private Type type=Type.FREE_FORM;
	private int size=1;
	private boolean nullable = true;
	private Object defaultValue=null;
	
	private String referencedTable = null;
	private String businessIdAppender=null;
}
