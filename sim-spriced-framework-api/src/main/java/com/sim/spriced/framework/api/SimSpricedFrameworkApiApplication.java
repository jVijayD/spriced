package com.sim.spriced.framework.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = DataSourceAutoConfiguration.class,scanBasePackages = {"com.sim.spriced","com.sim.spriced.*.*"} )
public class SimSpricedFrameworkApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(SimSpricedFrameworkApiApplication.class, args);
	}

}
