package com.sim.spriced.framework.models.connector;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SinkConfig {

    @JsonProperty("connector.class")
    private String connectorClass;

    @JsonProperty("connection.url")
    private String connectionUrl;

    @JsonProperty("connection.user")
    private String connectionUser;

    @JsonProperty("connection.password")
    private String connectionPassword;

    @JsonProperty("tasks.max")
    private Integer tasksMax;

    @JsonProperty("topics")
    private String topics;

    @JsonProperty("auto.create")
    private Boolean autoCreate;

    @JsonProperty("auto.evolve")
    private Boolean autoEvolve;

    @JsonProperty("insert.mode")
    private String insertMode;

    @JsonProperty("table.name.format")
    private String tableNameFormat;

    @JsonProperty("delete.enabled")
    private Boolean deleteEnabled;

    @JsonProperty("pk.mode")
    private String pkMode;

    @JsonProperty("pk.fields")
    private String pkFields;

    @JsonProperty("fields.whitelist")
    private String fieldsWhitelist;

    @JsonProperty("transforms")
    private String transforms;

    @JsonProperty("transforms.transform1.type")
    private String transform1Type;

    @JsonProperty("transforms.transform1.field")
    private String transform1Field;

    @JsonProperty("transforms.transform1.format")
    private String transform1Format;

    @JsonProperty("transforms.transform1.target.type")
    private String transform1TargetType;

    @JsonProperty("transforms.transform2.type")
    private String transform2Type;

    @JsonProperty("transforms.transform2.field")
    private String transform2Field;

    @JsonProperty("transforms.transform2.format")
    private String transform2Format;

    @JsonProperty("transforms.transform2.target.type")
    private String transform2TargetType;

    @JsonProperty("transforms.transform3.type")
    private String transform3Type;

    @JsonProperty("transforms.transform3.field")
    private String transform3Field;

    @JsonProperty("transforms.transform3.format")
    private String transform3Format;

    @JsonProperty("transforms.transform3.target.type")
    private String transform3TargetType;

    @JsonProperty("transforms.transform4.type")
    private String transform4Type;

    @JsonProperty("transforms.transform4.field")
    private String transform4Field;

    @JsonProperty("transforms.transform4.format")
    private String transform4Format;

    @JsonProperty("transforms.transform4.target.type")
    private String transform4TargetType;

    @JsonProperty("transforms.transform5.type")
    private String transform5Type;

    @JsonProperty("transforms.transform5.field")
    private String transform5Field;

    @JsonProperty("transforms.transform5.format")
    private String transform5Format;

    @JsonProperty("transforms.transform5.target.type")
    private String transform5TargetType;

    @JsonProperty("transforms.transform6.type")
    private String transform6Type;

    @JsonProperty("transforms.transform6.field")
    private String transform6Field;

    @JsonProperty("transforms.transform6.format")
    private String transform6Format;

    @JsonProperty("transforms.transform6.target.type")
    private String transform6TargetType;

    @JsonProperty("transforms.transform7.type")
    private String transform7Type;

    @JsonProperty("transforms.transform7.field")
    private String transform7Field;

    @JsonProperty("transforms.transform7.format")
    private String transform7Format;

    @JsonProperty("transforms.transform7.target.type")
    private String transform7TargetType;

    @JsonProperty("transforms.transform8.type")
    private String transform8Type;

    @JsonProperty("transforms.transform8.field")
    private String transform8Field;

    @JsonProperty("transforms.transform8.format")
    private String transform8Format;

    @JsonProperty("transforms.transform8.target.type")
    private String transform8TargetType;

    public SinkConfig(String connectorClass, String connectionUrl, String connectionUser, String connectionPassword, Integer tasksMax,
                      String topics, Boolean autoCreate, Boolean autoEvolve, String insertMode, String tableNameFormat, String fieldsWhitelist){
        this.connectorClass = connectorClass;
        this.connectionUrl = connectionUrl;
        this.connectionUser = connectionUser;
        this.connectionPassword = connectionPassword;
        this.tasksMax = tasksMax;
        this.topics = topics;
        this.autoCreate = autoCreate;
        this.autoEvolve = autoEvolve;
        this.insertMode = insertMode;
        this.tableNameFormat = tableNameFormat;
        this.fieldsWhitelist = fieldsWhitelist;
    }

    public SinkConfig(String connectorClass, String connectionUrl, String connectionUser, String connectionPassword, Integer tasksMax,
                      String topics, Boolean autoCreate, Boolean autoEvolve, String insertMode, String tableNameFormat, String fieldsWhitelist,
                      String transforms, String transform1Type, String transform1Field, String transform1Format, String transform1TargetType){
        this.connectorClass = connectorClass;
        this.connectionUrl = connectionUrl;
        this.connectionUser = connectionUser;
        this.connectionPassword = connectionPassword;
        this.tasksMax = tasksMax;
        this.topics = topics;
        this.autoCreate = autoCreate;
        this.autoEvolve = autoEvolve;
        this.insertMode = insertMode;
        this.tableNameFormat = tableNameFormat;
        this.fieldsWhitelist = fieldsWhitelist;
        this.transforms = transforms;
        this.transform1Type = transform1Type;
        this.transform1Field = transform1Field;
        this.transform1Format = transform1Format;
        this.transform1TargetType = transform1TargetType;
    }

    public SinkConfig(String connectorClass, String connectionUrl, String connectionUser, String connectionPassword, Integer tasksMax,
                      String topics, Boolean autoCreate, Boolean autoEvolve, String insertMode, String tableNameFormat, String fieldsWhitelist,
                      String transforms, String transform1Type, String transform1Field, String transform1Format, String transform1TargetType,
                      String transform2Type, String transform2Field, String transform2Format, String transform2TargetType){
        this.connectorClass = connectorClass;
        this.connectionUrl = connectionUrl;
        this.connectionUser = connectionUser;
        this.connectionPassword = connectionPassword;
        this.tasksMax = tasksMax;
        this.topics = topics;
        this.autoCreate = autoCreate;
        this.autoEvolve = autoEvolve;
        this.insertMode = insertMode;
        this.tableNameFormat = tableNameFormat;
        this.fieldsWhitelist = fieldsWhitelist;
        this.transforms = transforms;
        this.transform1Type = transform1Type;
        this.transform1Field = transform1Field;
        this.transform1Format = transform1Format;
        this.transform1TargetType = transform1TargetType;
        this.transform2Type = transform2Type;
        this.transform2Field = transform2Field;
        this.transform2Format = transform2Format;
        this.transform2TargetType = transform2TargetType;
    }

    public SinkConfig(String connectorClass, String connectionUrl, String connectionUser, String connectionPassword, Integer tasksMax,
                      String topics, Boolean autoCreate, Boolean autoEvolve, String insertMode, String tableNameFormat, String fieldsWhitelist,
                      String transforms, String transform1Type, String transform1Field, String transform1Format, String transform1TargetType,
                      String transform2Type, String transform2Field, String transform2Format, String transform2TargetType,
                      String transform3Type, String transform3Field, String transform3Format, String transform3TargetType){
        this.connectorClass = connectorClass;
        this.connectionUrl = connectionUrl;
        this.connectionUser = connectionUser;
        this.connectionPassword = connectionPassword;
        this.tasksMax = tasksMax;
        this.topics = topics;
        this.autoCreate = autoCreate;
        this.autoEvolve = autoEvolve;
        this.insertMode = insertMode;
        this.tableNameFormat = tableNameFormat;
        this.fieldsWhitelist = fieldsWhitelist;
        this.transforms = transforms;
        this.transform1Type = transform1Type;
        this.transform1Field = transform1Field;
        this.transform1Format = transform1Format;
        this.transform1TargetType = transform1TargetType;
        this.transform2Type = transform2Type;
        this.transform2Field = transform2Field;
        this.transform2Format = transform2Format;
        this.transform2TargetType = transform2TargetType;
        this.transform3Type = transform3Type;
        this.transform3Field = transform3Field;
        this.transform3Format = transform3Format;
        this.transform3TargetType = transform3TargetType;
    }


}
