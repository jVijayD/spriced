package com.sim.spriced.defnition.data.service.impl;

import com.sim.spriced.defnition.clients.IDataIngestionService;
import com.sim.spriced.defnition.data.service.EntityDefnitionEvent;
import com.sim.spriced.defnition.data.service.IEntityIngestionService;
import com.sim.spriced.framework.models.Attribute;
import com.sim.spriced.framework.models.AttributeConstants;
import com.sim.spriced.framework.models.EntityDefnition;
import com.sim.spriced.framework.models.connector.ConnectorClass;
import com.sim.spriced.framework.pubsub.IObserver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EntityIngestionService implements IEntityIngestionService, IObserver<EntityDefnitionEvent> {

    @Autowired
    IDataIngestionService dataIngestionService;

    @Value("${connect.db.url}")
    private String connectDbUrl;
    @Value("${connect.db.user}")
    private String connectDbUser;
    @Value("${connect.db.password}")
    private String connectDbPassword;
    @Value("${connect.input.mount.path}")
    private String connectorInputPath;

    public static final String sourceConnector = "com.sim.spriced.handler.injestion.source.connector.CsvSourceConnector";

    public static final String sinkConnector = "io.confluent.connect.jdbc.JdbcSinkConnector";

    @Override
    public void update(EntityDefnitionEvent arg) {
        switch (arg.getType()) {
            case ADD:
                this.createConnectorsAndUpsert(arg.getEntity());
                break;
            case UPDATE:
                this.updateSchema(arg.getEntity(), arg.getPreviousEntity());
                break;
            case DELETE:
                this.deleteConnector(arg.getEntity());
                break;
            default:
                throw new UnsupportedOperationException();
        }
    }

    public void createConnectorsAndUpsert(EntityDefnition defnition) {
        Map<String, String> attributeList = getDataTypes(defnition.getAttributes());
        String dataTypes = this.convertPairToComaSeparated(attributeList);
        String nonNullableFields = String.join(",", getNotNullableFields(defnition.getAttributes()));
        List<String> attributeNames = new ArrayList<>();
        List<String> dateFields = new ArrayList<>();
        List<String> primaryKey = new ArrayList<>();
        defnition.getAttributes().forEach(attribute -> {
            attributeNames.add(attribute.getName());
            if (attribute.getDataType().equals(AttributeConstants.DataType.TIME_STAMP)) {
                dateFields.add(attribute.getName());
            }
            if (attribute.getConstraintType().equals(AttributeConstants.ConstraintType.PRIMARY_KEY)){
                primaryKey.add(attribute.getName());
            }
        });
        List<String> transformFields = new ArrayList<>(dateFields);
        Map<String, Object> sourceConfig = setSource(getFileName(defnition.getName()), defnition.getName(), dataTypes, nonNullableFields, attributeNames);
        Map<String, Object> sinkConfig = setSink(defnition.getName(), defnition.getName(), attributeNames, transformFields, primaryKey);

        ConnectorClass source = new ConnectorClass(setConnectName(defnition.getName(), true),sourceConfig);
        ConnectorClass sink = new ConnectorClass(setConnectName(defnition.getName(), false), sinkConfig);
        ingestData(source, sink);
    }

    public void deleteConnector(EntityDefnition defnition){
        String sourceName = setConnectName(defnition.getName(), true);
        String sinkName = setConnectName(defnition.getName(), false);
        List<String> availableConnectors = dataIngestionService.getAllConnectors().getBody();
        if (null!=availableConnectors && availableConnectors.contains(sourceName)){
            dataIngestionService.deleteConnector(sourceName);
        }
        if (null!=availableConnectors && availableConnectors.contains(sinkName)){
            dataIngestionService.deleteConnector(sinkName);
        }
    }

    public void updateSchema(EntityDefnition defnition, EntityDefnition previousDefnition){
        String sourceName = setConnectName(previousDefnition.getName(), true);
        String sinkName = setConnectName(previousDefnition.getName(), false);
        ResponseEntity<String> sourceResponse = dataIngestionService.deleteConnector(sourceName);
        ResponseEntity<String> sinkResponse = dataIngestionService.deleteConnector(sinkName);
        if (sourceResponse.getStatusCode().equals(HttpStatus.valueOf(204)) || sinkResponse.getStatusCode().equals(HttpStatus.valueOf(204))){
            Map<String, String> attributeList = getDataTypes(defnition.getAttributes());
            String dataTypes = this.convertPairToComaSeparated(attributeList);
            String nonNullableFields = String.join(",", getNotNullableFields(defnition.getAttributes()));
            List<String> attributeNames = new ArrayList<>();
            List<String> dateFields = new ArrayList<>();
            List<String> primaryKey = new ArrayList<>();
            defnition.getAttributes().forEach(attribute -> {
                attributeNames.add(attribute.getName());
                if (attribute.getDataType().equals(AttributeConstants.DataType.TIME_STAMP)) {
                    dateFields.add(attribute.getName());
                }
                if (attribute.getConstraintType().equals(AttributeConstants.ConstraintType.PRIMARY_KEY)){
                    primaryKey.add(attribute.getName());
                }
            });
            List<String> transformFields = new ArrayList<>(dateFields);
            Map<String, Object> sourceConfig = setSource(getFileName(defnition.getName()), defnition.getName(), dataTypes, nonNullableFields, attributeNames);
            Map<String, Object> sinkConfig = setSink(defnition.getName(), defnition.getName(), attributeNames, transformFields, primaryKey);
            ConnectorClass source = new ConnectorClass(setConnectName(defnition.getName(), true),sourceConfig);
            ConnectorClass sink = new ConnectorClass(setConnectName(defnition.getName(), false),sinkConfig);
            this.ingestData(source, sink);
        }

    }
    private String getFileName(String filName) {
        return "^+"+filName+".*";   //process all files whose name starts with entity name
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
                case DECIMAL, DOUBLE -> attributeList.put(attribute.getName(), "float64");
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

    private Map<String, Object> setSource(String file, String topic, String dataTypes, String nonNullableFields, List<String> attributeNames) {
        String headerFilePath = connectorInputPath + File.separator + topic;
        // Check if a file starting with topic exists in the input path
        File[] files = new File(connectorInputPath).listFiles((dir, name) -> name.startsWith(topic));
        if (files == null || files.length == 0) {
            attributeNames.remove("is_valid");
            attributeNames.remove("updated_date");
            attributeNames.remove("updated_by");
            attributeNames.remove("comment");
            // Create a new file with the specified name in the input path
            createHeaderFile(headerFilePath, String.join(",", attributeNames));
        }

        Map<String, Object> sourceConfig = new HashMap<>();
        sourceConfig.put("connector.class", sourceConnector);
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
        sourceConfig.put("transforms.castTypes.spec", dataTypes);
        sourceConfig.put("csv.null.field.indicator", "EMPTY_SEPARATORS");
        sourceConfig.put("nullable.fields", nonNullableFields);
        sourceConfig.put("halt.on.error", false);
        return sourceConfig;
    }

    private void createHeaderFile(String filePath, String fields) {
        try (FileWriter writer = new FileWriter(filePath)) {
            writer.write(fields);
            writer.write("\n");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private Map<String, Object> setSink(String topic, String table, List<String> attributeNames, List<String> transformFields, List<String> primaryKey){
        Map<String, Object> sinkConfig = new HashMap<>();
        attributeNames.add("is_valid");
        attributeNames.add("updated_date");
        attributeNames.add("updated_by");
        attributeNames.add("comment");
        sinkConfig.put("connector.class",sinkConnector);
        sinkConfig.put("connection.url",connectDbUrl);
        sinkConfig.put("connection.user",connectDbUser);
        sinkConfig.put("connection.password",connectDbPassword);
        sinkConfig.put("tasks.max",1);
        sinkConfig.put("topics", topic);
        sinkConfig.put("auto.create",true);
        sinkConfig.put("auto.evolve", true);
        sinkConfig.put("insert.mode","upsert");
        sinkConfig.put("pk.mode", "record_value");
        sinkConfig.put("pk.fields",String.join(",", primaryKey));
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
        ResponseEntity<String> sourceResponse = dataIngestionService.ingestData(sourceClass);
        if (sourceResponse.getStatusCode().equals(HttpStatus.valueOf(201))){
            ResponseEntity<String> sinkResponse = dataIngestionService.ingestData(sinkClass);
        }
    }
}
