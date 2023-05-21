package com.sim.spriced.data;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.sim.spriced"})
public class SimSpricedDataApplication {

	public static void main(String[] args) {
		SpringApplication.run(SimSpricedDataApplication.class, args);
	}

}
