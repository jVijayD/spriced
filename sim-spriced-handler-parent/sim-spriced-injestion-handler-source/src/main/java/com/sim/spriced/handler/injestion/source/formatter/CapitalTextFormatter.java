package com.sim.spriced.handler.injestion.source.formatter;

import org.apache.kafka.connect.source.SourceRecord;

public class CapitalTextFormatter implements IFormatter {

	private static final String NAME = "CapitalFormatter";
	private final String column;
	public CapitalTextFormatter(String columnName) {
		this.column = columnName;
	}
	
	@Override
	public String getName() {
		return NAME;
	}

	@Override
	public SourceRecord format(SourceRecord input) {
		return input;
	}

}
