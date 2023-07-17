package com.sim.spriced.defnition.data.service.impl;

import com.sim.spriced.defnition.clients.IDataIngestionService;
import com.sim.spriced.defnition.constants.ConnectConstants;
import com.sim.spriced.defnition.data.service.IIngestionService;
import com.sim.spriced.framework.models.Attribute;
import com.sim.spriced.framework.models.AttributeConstants;
import com.sim.spriced.framework.models.EntityDefnition;
import com.sim.spriced.framework.models.connector.ConnectorClass;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class IngestionService implements IIngestionService {

    @Autowired
    IDataIngestionService dataIngestionService;

    @Override
    public void setConnectorAndIngestData(EntityDefnition defnition) {
        Map<String, String> attributeList = getDataTypes(defnition.getAttributes());
        String dataTypes = this.convertPairToComaSeparated(attributeList);
        String nonNullableFields = String.join(",", getNotNullableFields(defnition.getAttributes()));
        List<String> attributeNames = new ArrayList<>();
        List<String> dateFields = new ArrayList<>();
        defnition.getAttributes().forEach(attribute -> {
            attributeNames.add(attribute.getName());
            if (attribute.getDataType().equals(AttributeConstants.DataType.TIME_STAMP)) {
                dateFields.add(attribute.getName());
            }
        });
        List<String> transformFields = new ArrayList<>();
        for (String field: dateFields){
            transformFields.add(field);
        }
        Map<String, Object> sourceConfig = setSource(getFileName(defnition.getName()), defnition.getName(), dataTypes, nonNullableFields);
        Map<String, Object> sinkConfig = setSink(defnition.getName(), defnition.getName(), attributeNames, transformFields);

        ConnectorClass source = new ConnectorClass(setConnectName(defnition.getName(), true),sourceConfig);
        ConnectorClass sink = new ConnectorClass(setConnectName(defnition.getName(), false), sinkConfig);
        ingestData(source, sink);
    }
    private String getFileName(String filName) {
        return "^+"+filName+".*";//^file.*
    }

    private String setConnectName(String name, boolean isSource){
        if (isSource) {
            return name + "-source";
        }else {
            return name+ "-sink";
        }
    }

    private Map<String, String> getDataTypes(List<Attribute> attributes) {
        Map<String, String> attributeList = new HashMap<>();
        attributes.forEach(attribute ->{
            switch (attribute.getDataType()) {
                case INTEGER, AUTO -> attributeList.put(attribute.getName(), "int64");
                case DECIMAL -> attributeList.put(attribute.getName(), "float64");
            }
        });
        return attributeList;
    }
    private List<String> getNotNullableFields(List<Attribute> attributes){
        List<String> attributeList = new ArrayList<>();
        attributes.forEach(attribute ->{
            if (!attribute.isNullable()){
                attributeList.add(attribute.getName());
            }
        });
        attributeList.remove("updated_by");
        attributeList.remove("updated_date");
        attributeList.remove("is_valid");
        attributeList.remove("comment");
        return attributeList;
    }

    private String convertPairToComaSeparated(Map<String, String> attributeList){
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, String> entry : attributeList.entrySet()) {
            sb.append(entry.getKey()).append(":").append(entry.getValue()).append(",");
        }
        // Remove the trailing comma
        if (sb.length() > 0) {
            sb.deleteCharAt(sb.length() - 1);
        }
        return sb.toString();
    }

    private Map<String, Object> setSource(String file, String topic, String dataTypes, String nonNullableFields){
        Map<String, Object> sourceConfig = new HashMap<>();
        sourceConfig.put("connector.class", ConnectConstants.sourceConnector);
        sourceConfig.put("tasks.max", 1);
        sourceConfig.put("input.path", "/usr/share/file");
        sourceConfig.put("input.file.pattern", file);
        sourceConfig.put("error.path", "/usr/share/empty");
        sourceConfig.put("finished.path", "/usr/share/games");
        sourceConfig.put("topic", topic);
        sourceConfig.put("csv.first.row.as.header", true);
        sourceConfig.put("schema.generation.enabled", true);
        sourceConfig.put("transforms", "castTypes");
        sourceConfig.put("transforms.castTypes.type", "org.apache.kafka.connect.transforms.Cast$Value");
        sourceConfig.put("transforms.castTypes.spec",dataTypes);
        sourceConfig.put("csv.null.field.indicator","EMPTY_SEPARATORS");
        sourceConfig.put("nullable.fields", nonNullableFields);
        return sourceConfig;
    }

    private Map<String, Object> setSink(String topic, String table, List<String> attributeNames, List<String> transformFields){
        Map<String, Object> sinkConfig = new HashMap<>();
        sinkConfig.put("connector.class",ConnectConstants.sinkConnector);
        sinkConfig.put("connection.url","jdbc:postgresql://host.docker.internal:5432/spriced_meritor");
        sinkConfig.put("connection.user","postgres");
        sinkConfig.put("connection.password","password");
        sinkConfig.put("tasks.max",1);
        sinkConfig.put("topics", topic);
        sinkConfig.put("auto.create",true);
        sinkConfig.put("auto.evolve", true);
        sinkConfig.put("insert.mode","insert");
        sinkConfig.put("table.name.format", table);
        sinkConfig.put("fields.whitelist",String.join(",", attributeNames));
        if (transformFields.size()!=0){
            sinkConfig.put("transforms",String.join(",",transformFields));
            transformFields.forEach(field -> {
                sinkConfig.put("transforms."+field+".type","org.apache.kafka.connect.transforms.TimestampConverter$Value");
                sinkConfig.put("transforms."+field+".field",field);
                sinkConfig.put("transforms."+field+".format", "yyyy-MM-dd");
                sinkConfig.put("transforms."+field+".target.type", "Timestamp");
            });
        }
        return sinkConfig;
    }

    private void ingestData(ConnectorClass sourceClass,ConnectorClass sinkClass){
        ResponseEntity<String> sourceResponse = dataIngestionService.sendToConnect(sourceClass);
        if (sourceResponse.getStatusCode().equals(HttpStatus.valueOf(201))){
            ResponseEntity<String> sinkResponse = dataIngestionService.sendToConnect(sinkClass);
        }
    }
}
