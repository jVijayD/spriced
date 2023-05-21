package com.sim.spriced.defnition;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;



@SpringBootTest
@Import(MultitenantTestConfiguration.class)
class SimSpricedDefnitionApplicationTests {

	@Test
	void contextLoads() {
	}

}
