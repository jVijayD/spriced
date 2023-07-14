package com.sim.spriced.framework.models.connector;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SourceConfig {

    @JsonProperty("connector.class")
    private String connectorClass;

    @JsonProperty("tasks.max")
    private Integer tasksMax;

    @JsonProperty("input.path")
    private String inputPath;

    @JsonProperty("input.file.pattern")
    private String inputFilePattern;

    @JsonProperty("error.path")
    private String errorPath;

    @JsonProperty("finished.path")
    private String finishedPath;

    @JsonProperty("topic")
    private String topic;

    @JsonProperty("csv.first.row.as.header")
    private Boolean csvFirstRowAsHeader;

    @JsonProperty("schema.generation.enabled")
    private Boolean schemaGenerationEnabled;

    @JsonProperty("fields.calculate")
    private String fieldsCalculate;

    @JsonProperty("value.combine")
    private String valueCombine;

    @JsonProperty("clean.fields")
    private String cleanFields;

    @JsonProperty("schema.generation.key.fields")
    private String schemaGenerationKeyFields;

    @JsonProperty("schema.generation.key.name")
    private String schemaGenerationKeyName;

    @JsonProperty("schema.generation.value.name")
    private String schemaGenerationValueName;

    @JsonProperty("transforms")
    private String transforms;

    @JsonProperty("transforms.castTypes.type")
    private String transformsCastTypesType;

    @JsonProperty("transforms.castTypes.spec")
    private String transformsCastTypesSpec;

    @JsonProperty("csv.null.field.indicator")
    private String csvNullFieldIndicator;

    @JsonProperty("nullable.fields")
    private String nonNullableFields;

    public SourceConfig(String connectorClass, int tasksMax, String inputPath, String inputFilePattern, String errorPath,
                        String finishedPath, String topic, boolean csvFirstRowAsHeader, boolean schemaGenerationEnabled,
                        String csvNullFieldIndicator, String transforms, String transformsCastTypesType, String transformsCastTypesSpec,
                        String nonNullableFields) {
        this.connectorClass = connectorClass;
        this.tasksMax = tasksMax;
        this.inputPath = inputPath;
        this.inputFilePattern = inputFilePattern;
        this.errorPath = errorPath;
        this.finishedPath = finishedPath;
        this.topic = topic;
        this.csvFirstRowAsHeader = csvFirstRowAsHeader;
        this.schemaGenerationEnabled = schemaGenerationEnabled;
        this.csvNullFieldIndicator = csvNullFieldIndicator;
        this.transforms = transforms;
        this.transformsCastTypesType = transformsCastTypesType;
        this.transformsCastTypesSpec = transformsCastTypesSpec;
        this.nonNullableFields = nonNullableFields;
    }
}
