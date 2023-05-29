package com.sim.spriced.framework.models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Table;

import com.sim.spriced.framework.annotations.ExtraColumnData;
import com.sim.spriced.framework.annotations.IDType;
import com.sim.spriced.framework.constants.ModelConstants;
import com.sim.spriced.framework.models.AttributeConstants.ConstraintType;
import com.sim.spriced.framework.models.AttributeConstants.DataType;
import com.sim.spriced.framework.models.AttributeConstants.Type;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Table(name = "entity")
public class EntityDefnition extends BaseEntity {

	private static final int NAME_SIZE = 25;
	private static final String CODE = "code";

	@ExtraColumnData(isPrimaryKey = true)
	@Column(name = ModelConstants.NAME)
	private String name;

	@ExtraColumnData(isPrimaryKey = true)
	@Column(name = "group")
	private String group;

	@Column(name = ModelConstants.VERSION)
	@ExtraColumnData(isPrimaryKey = true, id = IDType.VERSION_SEQ)
	private Integer version;

	@Column(name = ModelConstants.IS_DISABLED)
	private Boolean isDisabled=false;

	@Column(name = ModelConstants.ATTRIBUTES)
	@ExtraColumnData(convertToJson = true, exclude = true)
	private final List<Attribute> attributes = new ArrayList<>();

	public EntityDefnition(String name) {
		this.name = name;
	}
	
	public EntityDefnition(String name,String group) {
		this.name = name;
		this.group = group;
	}

	public EntityDefnition(String name, boolean isDisabled) {
		this.name = name;
		this.isDisabled = isDisabled;
	}

	public boolean validate() {
		this.validateAttributes();
		return true;
	}

	private void validateAttributes() {
		int nameCount = 0;
		int primaryKeyCount = 0;
		for (var attr : this.attributes) {
			if (attr.getName().equals(ModelConstants.NAME)) {
				nameCount = nameCount + 1;
			}
			if(attr.getConstraintType() == ConstraintType.PRIMARY_KEY) {
				primaryKeyCount = primaryKeyCount + 1;
			}
			
			if(attr.getConstraintType()==ConstraintType.PRIMARY_KEY || attr.getConstraintType()==ConstraintType.FOREIGN_KEY || attr.getDataType()==DataType.BUSINESS_SEQUENCE) {
				attr.setNullable(false);
			}
		}
		
		if(primaryKeyCount==0) {
			Attribute codeAttr = new Attribute(CODE,Type.FREE_FORM,DataType.AUTO);
			codeAttr.setConstraintType(ConstraintType.PRIMARY_KEY);
			codeAttr.setNullable(false);
			this.attributes.add(0,codeAttr);
		}
		
		if(nameCount==0) {
			Attribute nameAttr = new Attribute(ModelConstants.NAME,Type.FREE_FORM,DataType.STRING_VAR , NAME_SIZE);
			nameAttr.setConstraintType(ConstraintType.UNIQUE_KEY);
			nameAttr.setNullable(false);
			this.attributes.add(1,nameAttr);
		}
		
	}
}
