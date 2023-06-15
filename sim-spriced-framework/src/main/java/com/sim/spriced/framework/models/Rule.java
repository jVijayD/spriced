package com.sim.spriced.framework.models;

import javax.persistence.Column;
import javax.persistence.Table;

import com.sim.spriced.framework.annotations.ExtraColumnData;
import com.sim.spriced.framework.annotations.IDType;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Table(name=Rule.TableConstants.TABLE)
public class Rule extends BaseEntity {
	
	@ExtraColumnData(isPrimaryKey = true,id=IDType.AUTO)
	@Column(name=Rule.TableConstants.ID)
	private Integer id;
	
//	@Column(name="model_id")
//	private Integer modelId;
	
	@Column(name=Rule.TableConstants.ENTITY_ID)
	private Integer entityId;
	
	@Column(name=Rule.TableConstants.PRIORITY)
	private Integer priority;
	
	@Column(name=Rule.TableConstants.NAME)
	private String name;
	
	@Column(name=Rule.TableConstants.DESCRIPTION)
	private String description;
	
	@Column(name=Rule.TableConstants.IS_EXCLUDED)
	private Boolean isExcluded;
	
	@Column(name=Rule.TableConstants.STATUS)
	private String status;
	
	@Column(name=Rule.TableConstants.NOTIFICATION)
	private String notification;
	
//	@Column(name="version")
//	private Integer version;
	
	@Column(name=Rule.TableConstants.CONDITION)
	@ExtraColumnData(convertToJson = true, exclude = true)
	private Condition condition;
	
	@Column(name=Rule.TableConstants.ACTION)
	@ExtraColumnData(convertToJson = true, exclude = true)
	private Action action;

	public Rule(String name) {
		this.name = name;
	}
	
	public Rule(Integer id) {
		this.id = id;
	}
	
	public Rule(Integer id,String name) {
		this.id = id;
		this.name = name;
	}
	
	@Override
	public boolean validate() {
		return true;
	}
	
	public static class TableConstants {
		public static final String TABLE = "rule";
		public static final String ID = "id";
		public static final String ENTITY_ID = "entity_id";
		public static final String PRIORITY = "priority";
		public static final String NAME = "name";
		public static final String DESCRIPTION = "description";
		public static final String IS_EXCLUDED = "is_excluded";
		public static final String STATUS = "status";
		public static final String NOTIFICATION = "notification";
		public static final String CONDITION = "condition";
		public static final String ACTION = "action";
		private TableConstants() {}
	}

}
