package com.sim.spriced.handler.injestion.source.formatter;

import org.apache.kafka.connect.source.SourceRecord;

public interface IFormatter {
	String getName();
	SourceRecord format(SourceRecord input);
}
