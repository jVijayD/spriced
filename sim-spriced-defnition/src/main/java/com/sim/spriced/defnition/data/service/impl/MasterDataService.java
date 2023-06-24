package com.sim.spriced.defnition.data.service.impl;

import com.sim.spriced.defnition.data.service.IMasterDataService;
import com.sim.spriced.framework.annotations.IDType;
import com.sim.spriced.framework.models.AttributeConstants;
import com.sim.spriced.framework.models.Condition;

import org.json.simple.JSONObject;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MasterDataService implements IMasterDataService {
	@Override
	public EnumMap<AttributeConstants.DataType, String> getAllDataType() {
		EnumMap<AttributeConstants.DataType, String> dataMap = new EnumMap<>(AttributeConstants.DataType.class);
		Arrays.asList(AttributeConstants.DataType.values())
				.forEach(dataType -> dataMap.put(dataType, dataType.getDisplayName()));
		return dataMap;
	}

	@Override
	public EnumMap<AttributeConstants.Type, String> getAllType() {
		EnumMap<AttributeConstants.Type, String> dataMap = new EnumMap<>(AttributeConstants.Type.class);
		Arrays.asList(AttributeConstants.Type.values())
				.forEach(dataType -> dataMap.put(dataType, dataType.getDisplayName()));
		return dataMap;
	}

	@Override
	public EnumMap<AttributeConstants.ConstraintType, String> getAllConstraintType() {
		EnumMap<AttributeConstants.ConstraintType, String> dataMap = new EnumMap<>(
				AttributeConstants.ConstraintType.class);
		Arrays.asList(AttributeConstants.ConstraintType.values())
				.forEach(dataType -> dataMap.put(dataType, dataType.getDisplayName()));
		return dataMap;
	}

	@Override
	public EnumMap<IDType, String> getAllIdType() {
		EnumMap<IDType, String> dataMap = new EnumMap<>(IDType.class);
		Arrays.asList(IDType.values()).forEach(item -> dataMap.put(item, item.toString()));
		return dataMap;
	}

	@Override
	public EnumMap<Condition.ConditionType, String> getAllConditionType() {
		EnumMap<Condition.ConditionType, String> dataMap = new EnumMap<>(Condition.ConditionType.class);
		Arrays.asList(Condition.ConditionType.values()).forEach(dataType -> 
			dataMap.put(dataType, dataType.getValue())
		);
		return dataMap;
	}

	@Override
	public EnumMap<Condition.OperatorType, String> getAllOperatorType() {
		EnumMap<Condition.OperatorType, String> dataMap = new EnumMap<>(Condition.OperatorType.class);
		Arrays.asList(Condition.OperatorType.values()).forEach(dataType -> 
			dataMap.put(dataType, dataType.getValue())
		);
		return dataMap;
	}

	@Override
	public EnumMap<Condition.OperandType, String> getAllOperandType() {
		EnumMap<Condition.OperandType, String> dataMap = new EnumMap<>(Condition.OperandType.class);
		Arrays.asList(Condition.OperandType.values()).forEach(dataType -> 
			dataMap.put(dataType, dataType.getValue())
		);
		return dataMap;
	}

}
