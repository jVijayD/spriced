package com.sim.spriced.defnition.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class, 
	    DataSourceTransactionManagerAutoConfiguration.class, 
	    HibernateJpaAutoConfiguration.class}, scanBasePackages = { "com.sim.spriced",
		"com.sim.spriced.*.*" })
@EnableCaching
public class SimSpricedDefnitionApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(SimSpricedDefnitionApiApplication.class, args);
	}

}
