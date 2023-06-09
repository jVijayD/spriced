package com.sim.spriced.defnition.api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;


/***
 * Context loader for the test.
 * @author shabeeb
 *
 */
@SpringBootTest()
@Import(MultitenantTestConfiguration.class)
class SimSpricedDefnitionApiApplicationTests {

	//@Test
	void contextLoads() {
	}


}
