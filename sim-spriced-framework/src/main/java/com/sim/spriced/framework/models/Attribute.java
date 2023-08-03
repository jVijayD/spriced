package com.sim.spriced.framework.models;



import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sim.spriced.framework.constants.ModelConstants.ModelPermission;
import com.sim.spriced.framework.models.AttributeConstants.ConstraintType;
import com.sim.spriced.framework.models.AttributeConstants.DataType;
import com.sim.spriced.framework.models.AttributeConstants.Type;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Attribute {

	private String id= UUID.randomUUID().toString();
	private String name;
	private String displayName;
	private DataType dataType=DataType.STRING;
	private Type type=Type.FREE_FORM;
	private int size=25;
	private boolean nullable = true;
	private Object defaultValue=null;
	
	private String referencedTable = null;
	private String businessIdAppender=null;
	//type of referencedTableId can be string or integer
	private Object referencedTableId = null;
	private String formatter = null;
	private int numberOfDecimalValues = 0;
	private ModelPermission permission = ModelPermission.DENY;
	//constraints
	private ConstraintType constraintType = ConstraintType.NONE;
	
	
	private boolean isAutoGenerated = false;
	private boolean isEditable = true;
	private boolean showInForm = true;
	private boolean isSystemAttribute=false;
	
	public Attribute(String name) {
		this.name = name;
	}
	
	public Attribute(String name,Type type,DataType dataType) {
		this(name);
		this.dataType = dataType;
		this.type = type;
	}

	
	public Attribute(String name,Type type,DataType dataType,int size) {
		this(name,type,dataType);
		this.size=size;
	}
        
}
