package com.sim.spriced.defnition.clients;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.sim.spriced.defnition.constants.ConnectConstants;
import com.sim.spriced.defnition.interceptor.FeignClientConfig;
import com.sim.spriced.framework.models.connector.ConnectorClass;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "connect-api",url= ConnectConstants.connectBaseUrl,configuration = FeignClientConfig.class)
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public interface IDataIngestionService {

    @PostMapping(value = "/connectors", consumes = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<String> sendToConnect(ConnectorClass data);
}
