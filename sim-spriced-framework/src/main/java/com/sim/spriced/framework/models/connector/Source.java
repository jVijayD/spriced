package com.sim.spriced.framework.models.connector;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Source {

    @JsonProperty("name")
    private String name;

    @JsonProperty("config")
    private SourceConfig sourceConfig;
}
