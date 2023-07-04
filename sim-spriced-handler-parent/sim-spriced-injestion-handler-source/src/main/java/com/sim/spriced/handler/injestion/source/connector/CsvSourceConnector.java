package com.sim.spriced.handler.injestion.source.connector;

import org.apache.kafka.connect.connector.Task;

import com.github.jcustenborder.kafka.connect.spooldir.SpoolDirCsvSourceConnector;

public class CsvSourceConnector extends SpoolDirCsvSourceConnector {
	 @Override
	    public Class<? extends Task> taskClass(){
	        return CsvSourceTask.class;
	    }

	    @Override
	    public String version() {
	        return "1.0.0";
	    }
}
