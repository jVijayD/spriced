package com.sim.spriced.defnition.data.service;

import com.sim.spriced.framework.annotations.IDType;
import com.sim.spriced.framework.models.AttributeConstants;
import com.sim.spriced.framework.models.Condition;

import java.util.HashMap;
import java.util.List;

public interface IMasterDataService {
    HashMap<AttributeConstants.DataType, String> getAllDataType();
    HashMap<AttributeConstants.Type, String> getAllType();
    HashMap<AttributeConstants.ConstraintType, String> getAllConstraintType();
    List<IDType> getAllIdType();
    HashMap<Condition.ConditionType, String> getAllConditionType();
    HashMap<Condition.OperatorType, String> getAllOperatorType();
    HashMap<Condition.OperandType, String> getAllOperandType();
}
