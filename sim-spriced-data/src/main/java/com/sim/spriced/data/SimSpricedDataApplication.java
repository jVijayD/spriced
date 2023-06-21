package com.sim.spriced.data;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication(exclude = DataSourceAutoConfiguration.class,scanBasePackages = {"com.sim.spriced","com.sim.spriced.*.*"} )
@EnableCaching
public class SimSpricedDataApplication {

	public static void main(String[] args) {
		SpringApplication.run(SimSpricedDataApplication.class, args);
	}

}
