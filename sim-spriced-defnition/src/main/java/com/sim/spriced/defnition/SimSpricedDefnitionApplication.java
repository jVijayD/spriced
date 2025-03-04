package com.sim.spriced.defnition;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication(exclude = DataSourceAutoConfiguration.class,scanBasePackages = {"com.sim.spriced","com.sim.spriced.*.*"} )
@EnableFeignClients
public class SimSpricedDefnitionApplication {

	public static void main(String[] args) {
		SpringApplication.run(SimSpricedDefnitionApplication.class, args);
	}

}
