package com.sim.spriced.defnition.constants;

public class ConnectConstants {
    public static final String connectBaseUrl = "http://localhost:8083";

    public static final String sourceConnector = "com.sim.spriced.handler.injestion.source.connector.CsvSourceConnector";

    public static final String sinkConnector = "io.confluent.connect.jdbc.JdbcSinkConnector";
}
