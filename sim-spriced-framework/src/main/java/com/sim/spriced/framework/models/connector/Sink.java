package com.sim.spriced.framework.models.connector;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.json.JSONObject;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Sink {

    @JsonProperty("name")
    private String name;

    @JsonProperty("config")
    private JSONObject sinkConfig;
}
