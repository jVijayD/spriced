package com.sim.spriced.data.repo;

import com.sim.spriced.framework.models.BulkEntityDetails;

public interface IBulkProcessRepo {
	
	BulkEntityDetails saveFileDetails(BulkEntityDetails fileEntity);

}
