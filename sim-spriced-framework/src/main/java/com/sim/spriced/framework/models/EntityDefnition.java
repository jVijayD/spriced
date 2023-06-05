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

	@ExtraColumnData(isPrimaryKey = true,id = IDType.AUTO)
	@Column(name = ModelConstants.ID)
	private Integer id;
	
	@Column(name = ModelConstants.NAME)
	private String name;
	
	@Column(name = ModelConstants.DISPLAY_NAME)
	private String displayName;

	@Column(name = "group_id")
	private Integer groupId;

	@Column(name = ModelConstants.IS_DISABLED)
	private Boolean isDisabled;
	
	@Column(name = ModelConstants.ENABLE_AUDIT_TRIAL)
	private Boolean enableAuditTrial;

	
	@Column(name = "comment")
	private String comment;
	
	@Column(name = ModelConstants.ATTRIBUTES)
	@ExtraColumnData(convertToJson = true, exclude = true)
	private final List<Attribute> attributes = new ArrayList<>();

	public EntityDefnition(int id) {
		this.id = id;
	}
	
	public EntityDefnition(String name) {
		this.name = name;
	}
	
	public EntityDefnition(String name,int groupId) {
		this.name = name;
		this.groupId = groupId;
	}

	public EntityDefnition(String name, boolean isDisabled) {
		this.name = name;
		this.isDisabled = isDisabled;
	}
	
	public void addAttributes(List<Attribute> attributes) {
		this.attributes.addAll(attributes);
	}

	@Override
	public boolean validate() {
		this.validateDisplayName();
		this.validateAttributes();
		return true;
	}

	private void validateDisplayName() {
		if(this.displayName==null) {
			this.displayName = this.name;
		}
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
		
		Attribute isValidAttr = new Attribute(ModelConstants.IS_VALID,Type.FREE_FORM,DataType.BOOLEAN);
		isValidAttr.setDefaultValue(true);
		this.attributes.add(isValidAttr);
		
		Attribute updatedDateAttr = new Attribute(ModelConstants.UPDATED_DATE,Type.FREE_FORM,DataType.TIME_STAMP);
		this.attributes.add(updatedDateAttr);
		
		Attribute updatedByAttr = new Attribute(ModelConstants.UPDATED_BY,Type.FREE_FORM,DataType.STRING_VAR,50);
		this.attributes.add(updatedByAttr);
		
		Attribute commentAttr = new Attribute(ModelConstants.COMMENT,Type.FREE_FORM,DataType.STRING_VAR,250);
		this.attributes.add(commentAttr);
	}
}
