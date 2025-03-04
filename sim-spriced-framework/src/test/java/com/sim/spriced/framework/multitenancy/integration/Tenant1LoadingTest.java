package com.sim.spriced.framework.multitenancy.integration;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.sql.SQLException;
import java.util.Properties;

import javax.sql.DataSource;

import org.jooq.DSLContext;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@SpringBootTest()
@Import(Tenant1Configuration.class)
class Tenant1LoadingTest {
	

	
	@Autowired
	public DataSource dataSource;
	
	@Autowired
	public DSLContext dsl;
	
	
	@Test
	void dataSourceLoadTest() throws SQLException {
		Properties prop = this.dataSource.getConnection().getClientInfo();
		assertNotNull(dataSource);
		assertNotNull(prop.get("ApplicationName"));
	}
	
	@Test
	void dslContextTest() throws SQLException {
		assertNotNull(dsl);
	}

}
