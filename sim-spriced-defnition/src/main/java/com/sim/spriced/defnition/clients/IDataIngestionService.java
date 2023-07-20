package com.sim.spriced.defnition.clients;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.sim.spriced.defnition.data.model.ConnectorClass;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@FeignClient(name = "connect-api",url="${connect.url}")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public interface IDataIngestionService {

    @PostMapping(value = "/connectors", consumes = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<String> ingestData(ConnectorClass data);

    @DeleteMapping(value = "/connectors/{connectorName}")
    ResponseEntity<String> deleteConnector(@PathVariable("connectorName") String connectorName);

    @GetMapping(value = "/connectors")
    ResponseEntity<List<String>> getAllConnectors();
}
