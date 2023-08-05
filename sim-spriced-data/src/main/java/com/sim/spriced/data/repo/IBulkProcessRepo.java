package com.sim.spriced.data.repo;

import java.util.List;

import com.sim.spriced.framework.models.BulkEntityDetails;

public interface IBulkProcessRepo {
	
	BulkEntityDetails saveFileDetails(BulkEntityDetails fileEntity);
	
	BulkEntityDetails updateBulkUploadDetails(BulkEntityDetails fileEntity);
	
	List<BulkEntityDetails> getUpdateDetails();
	
	BulkEntityDetails getUpdateDetails(BulkEntityDetails bulkEntityDetails);
	
	void deleteBulkUpdateDetails(BulkEntityDetails bulkEntityDetails);
}
