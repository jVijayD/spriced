package com.sim.spriced.defnition.data.service;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import com.sim.spriced.framework.annotations.IDType;
import com.sim.spriced.framework.models.AttributeConstants;
import com.sim.spriced.framework.models.Condition;

public interface IMasterDataService {
	EnumMap<AttributeConstants.DataType, String> getAllDataType();

	EnumMap<AttributeConstants.Type, String> getAllType();

	EnumMap<AttributeConstants.ConstraintType, String> getAllConstraintType();

	EnumMap<IDType,String> getAllIdType();

	EnumMap<Condition.ConditionType, String> getAllConditionType();

	EnumMap<Condition.OperatorType, String> getAllOperatorType();

	EnumMap<Condition.OperandType, String> getAllOperandType();
}
