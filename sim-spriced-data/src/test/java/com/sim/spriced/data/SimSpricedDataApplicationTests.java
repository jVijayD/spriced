package com.sim.spriced.data;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;



@SpringBootTest
@Import(MultitenantTestConfiguration.class)
class SimSpricedDataApplicationTests {

	@Test
	void contextLoads() {
	}

}
