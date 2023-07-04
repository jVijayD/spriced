package com.sim.spriced.handler.injestion.source.connector;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.kafka.connect.data.Field;
import org.apache.kafka.connect.data.Schema;
import org.apache.kafka.connect.data.SchemaBuilder;
import org.apache.kafka.connect.data.Struct;
import org.apache.kafka.connect.source.SourceRecord;

import com.github.jcustenborder.kafka.connect.spooldir.SpoolDirCsvSourceTask;
import com.sim.spriced.handler.injestion.source.utility.EquationParser;

public class CsvSourceTask extends SpoolDirCsvSourceTask {

	private String combineFieldsProperty;
	private String cleansingProperty;
	private String calculatedFields;

	private Boolean includeExistingKeySchema = false;
	public final List<String> toRemove = new ArrayList<>();
	public final Map<String, Object> toAdd = new HashMap<>();
	public final Map<String, Schema> toAddWithType = new HashMap<>();

	@Override
	public void start(Map<String, String> props) {
		super.start(props);
		initializeProperties(props);
	}

	@Override
	public List<SourceRecord> poll() throws InterruptedException {
		List<SourceRecord> records = super.poll();
		List<SourceRecord> filteredRecords = new ArrayList<>();
		


		for (SourceRecord rec : records) {
			Struct valueStruct = (Struct) rec.value();
			Schema newSchema = generateSchema(rec);
			Schema valueSchema = rec.valueSchema();
			applyProperties(valueStruct);
			if (null != combineFieldsProperty || null != calculatedFields) {
				if (null != combineFieldsProperty) {
					String[] properties = combineFieldsProperty.trim().split(",");
					for (String property : properties) {
						String[] fields = property.split(":");
						if (fields.length == 2) {
							String combinedFieldName = fields[0].trim();
							String[] sourceFields = fields[1].split("\\+");
							String newFieldValue = "";
							for (String sourceField : sourceFields) {
								Field field = valueSchema.field(sourceField);
								if (!valueStruct.schema().fields().contains(field)) {
									newFieldValue += sourceField;
								} else {
									newFieldValue += valueStruct.get(sourceField.trim()) + " ";
								}
							}
							String newValue = newFieldValue.trim();
							toAdd.put(combinedFieldName, newValue);
						}
					}
				}
				Struct newSchemaValues = insertValues(newSchema, valueStruct);
				SourceRecord newRecord;
				if (Boolean.TRUE.equals(includeExistingKeySchema)) {
					newRecord = new SourceRecord(rec.sourcePartition(), rec.sourceOffset(), rec.topic(),
							rec.kafkaPartition(), rec.keySchema(), rec.key(), newSchema, newSchemaValues);
				} else {
					newRecord = new SourceRecord(rec.sourcePartition(), rec.sourceOffset(), rec.topic(),
							rec.kafkaPartition(), newSchema, newSchemaValues);
				}
				filteredRecords.add(newRecord);
			} else {
				filteredRecords.add(rec);
			}
		}
		return filteredRecords;
	}

	void readProperties() {
		if (null != combineFieldsProperty) {
			generateCombinedProperty();
		}
		if (null != calculatedFields) {
			generateCalculatedFieldProperty();
		}
	}

	void generateCombinedProperty() {
		//name:first_name+last_name
		String[] properties = combineFieldsProperty.trim().split(",");
		for (String property : properties) {
			String[] fields = property.split(":");
			String combinedFieldName;
			String[] sourceFields;
			if (fields.length == 2) {
				combinedFieldName = fields[0].trim();
				sourceFields = fields[1].split("\\+");
				for (String sourceField : sourceFields) {
					toRemove.add(sourceField.trim());
				}
				toAddWithType.put(combinedFieldName, Schema.STRING_SCHEMA);
			}
		}
	}

	void generateCalculatedFieldProperty() {
		String[] properties = calculatedFields.trim().split(",");
		for (String property : properties) {
			String[] fields = property.split(":");
			String calculatedFieldName;
			if (fields.length == 2) {
				calculatedFieldName = fields[0].trim();
				toAddWithType.put(calculatedFieldName, Schema.FLOAT64_SCHEMA);
			}
		}
	}

	Schema generateSchema(SourceRecord record) {
		Struct valueStruct = (Struct) record.value();
		Schema existingSchema = valueStruct.schema();
		SchemaBuilder newSchemaBuilder = SchemaBuilder.struct();

		for (Field field : existingSchema.fields()) {
			String fieldName = field.name();
			if (!toRemove.contains(fieldName)) {
				newSchemaBuilder.field(fieldName, field.schema());
			}
		}

		toAddWithType.forEach(newSchemaBuilder::field);

		Schema newSchema = newSchemaBuilder.build();
		return newSchema;
	}

	Struct insertValues(Schema schema, Struct valueStruct) {
		Struct newSchemaValues = new Struct(schema);
		schema.fields().forEach(field -> {
			if (toAdd.containsKey(field.name())) {
				Object value = toAdd.get(field.name());
				newSchemaValues.put(field, value);
			} else {
				newSchemaValues.put(field, valueStruct.get(field.name()));
			}
		});
		return newSchemaValues;
	}

	private Object applyDataCleansing(String cleansingName, Object fieldValue) {
		Object cleansedValue = fieldValue;

		if (cleansingName.equalsIgnoreCase("trim_leading_and_trailing")) {
			if (fieldValue instanceof String) {
				cleansedValue = ((String) fieldValue).trim();
			}
		} else if (cleansingName.equalsIgnoreCase("convert_to_lowercase")) {
			if (fieldValue instanceof String) {
				cleansedValue = ((String) fieldValue).toLowerCase();
			}
		} else if (cleansingName.equalsIgnoreCase("convert_to_uppercase")) {
			if (fieldValue instanceof String) {
				cleansedValue = ((String) fieldValue).toUpperCase();
			}
		} else if (cleansingName.equalsIgnoreCase("remove_brackets")) {
			if (fieldValue instanceof String) {
				cleansedValue = ((String) fieldValue).replaceAll("[\\[\\](){}]", "");
			}
		}
		return cleansedValue;
	}

	public void applyProperties(Struct valueStruct) {
		if (null != cleansingProperty) {
			applyCleansing(cleansingProperty, valueStruct);
		}
		if (null != calculatedFields) {
			takeFields(calculatedFields, valueStruct);
		}
	}

	void takeFields(String calculatedFields, Struct valueStruct) {
		String[] properties = calculatedFields.trim().split(",");
		String mathExpression = null;
		for (String property : properties) {
			String[] individualProperty = property.trim().split(":");
			String newFieldName = individualProperty[0];
			mathExpression = individualProperty[1];
			for (Field field : valueStruct.schema().fields()) {
				String fieldName = field.name();
				if (mathExpression.contains("[" + fieldName + "]")) {
					Object fieldValue = valueStruct.get(fieldName);
					if (fieldValue != null) {
						mathExpression = mathExpression.replace("[" + fieldName + "]", fieldValue.toString());
					} else {
						mathExpression = mathExpression.replace("[" + fieldName + "]", "0");
					}
				}
			}
			toAdd.put(newFieldName, EquationParser.eval(mathExpression));
		}
	}

	void applyCleansing(String cleansingProperty, Struct valueStruct) {
		String[] properties = cleansingProperty.trim().split(",");
		for (String property : properties) {
			String[] individualProperty = property.trim().split(":");
			String fieldName = individualProperty[0];
			String cleanseProperty = individualProperty[1];
			for (Field field : valueStruct.schema().fields()) {
				if (fieldName.equals(field.name())) {
					Object cleansedValue = applyDataCleansing(cleanseProperty, valueStruct.get(fieldName));
					valueStruct.put(field, cleansedValue);
				}
			}
		}
	}

	private void initializeProperties(Map<String, String> props) {
		this.combineFieldsProperty = props.get("value.combine");
		this.cleansingProperty = props.get("clean.fields");
		this.calculatedFields = props.get("fields.calculate");
		if (null != combineFieldsProperty || null != calculatedFields) {
			readProperties();
		}
		if (null != props.get("schema.generation.key.fields")) {
			this.includeExistingKeySchema = true;
		}
	}

}
