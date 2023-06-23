package com.sim.spriced.defnition.data.service.impl;

import com.sim.spriced.defnition.data.service.IMasterDataService;
import com.sim.spriced.framework.annotations.IDType;
import com.sim.spriced.framework.models.AttributeConstants;
import com.sim.spriced.framework.models.Condition;
import com.sim.spriced.framework.pubsub.EventType;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MasterDataService implements IMasterDataService {
    @Override
    public HashMap<AttributeConstants.DataType, String> getAllDataType() {
        HashMap<AttributeConstants.DataType, String> dataMap = new HashMap<>();
        Arrays.asList(AttributeConstants.DataType.values()).forEach(dataType -> {
            dataMap.put(dataType, dataType.getDisplayName());
        });
        return dataMap;
    }

    @Override
    public HashMap<AttributeConstants.Type, String> getAllType() {
        HashMap<AttributeConstants.Type, String> dataMap = new HashMap<>();
        Arrays.asList(AttributeConstants.Type.values()).forEach(dataType -> {
            dataMap.put(dataType, dataType.getDisplayName());
        });
        return dataMap;
    }

    @Override
    public HashMap<AttributeConstants.ConstraintType, String> getAllConstraintType() {
        HashMap<AttributeConstants.ConstraintType, String> dataMap = new HashMap<>();
        Arrays.asList(AttributeConstants.ConstraintType.values()).forEach(dataType -> {
            dataMap.put(dataType, dataType.getDisplayName());
        });
        return dataMap;
    }

    @Override
    public List<IDType> getAllIdType() {
        return Arrays.asList(IDType.values());
    }

    @Override
    public HashMap<Condition.ConditionType, String> getAllConditionType() {
        HashMap<Condition.ConditionType, String> dataMap = new HashMap<>();
        Arrays.asList(Condition.ConditionType.values()).forEach(dataType -> {
            dataMap.put(dataType, dataType.getValue());
        });
        return dataMap;
    }

    @Override
    public HashMap<Condition.OperatorType, String> getAllOperatorType() {
        HashMap<Condition.OperatorType, String> dataMap = new HashMap<>();
        Arrays.asList(Condition.OperatorType.values()).forEach(dataType -> {
            dataMap.put(dataType, dataType.getValue());
        });
        return dataMap;
    }

    @Override
    public HashMap<Condition.OperandType, String> getAllOperandType() {
        HashMap<Condition.OperandType, String> dataMap = new HashMap<>();
        Arrays.asList(Condition.OperandType.values()).forEach(dataType -> {
            dataMap.put(dataType, dataType.getValue());
        });
        return dataMap;
    }

    @Override
    public List<EventType> getAllEventType() {
        return Arrays.asList(EventType.values());
    }
}
