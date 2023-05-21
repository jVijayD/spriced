package com.sim.spriced.framework;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class SimSpricedFrameworkApplication {

	public static void main(String[] args) {
		SpringApplication.run(SimSpricedFrameworkApplication.class, args);
	}

}
