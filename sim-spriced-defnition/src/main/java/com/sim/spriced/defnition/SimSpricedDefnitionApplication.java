package com.sim.spriced.defnition;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = DataSourceAutoConfiguration.class,scanBasePackages = {"com.sim.spriced","com.sim.spriced.*.*"} )
public class SimSpricedDefnitionApplication {

	public static void main(String[] args) {
		SpringApplication.run(SimSpricedDefnitionApplication.class, args);
	}

}
