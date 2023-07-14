package com.sim.spriced.defnition.clients;


import com.sim.spriced.defnition.interceptor.FeignClientConfig;
import org.json.JSONObject;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Map;

@FeignClient(name = "connect-api",url="http://localhost:8083",configuration = FeignClientConfig.class)
public interface IDataIngestionService {

    @PostMapping(value = "/connectors", consumes = MediaType.APPLICATION_JSON_VALUE)
    String sendToConnect(JSONObject data);
}
