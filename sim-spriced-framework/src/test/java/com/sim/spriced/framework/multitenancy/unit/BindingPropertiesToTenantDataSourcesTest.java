package com.sim.spriced.framework.multitenancy.unit;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import com.sim.spriced.framework.MultitenantTestConfiguration;
import com.sim.spriced.framework.multitenancy.TenantDataSourcesConfigProps;


@SpringBootTest()
@Import(MultitenantTestConfiguration.class)
class BindingPropertiesToTenantDataSourcesTest {
	
	
	@Autowired
	private TenantDataSourcesConfigProps tenantDataSources;
	

	
	@Test()
	void MultitenantDataSourceConfigTest() {
		assertEquals(2,tenantDataSources.getTenantDataSource().size());
	}


}
