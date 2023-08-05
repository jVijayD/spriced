package com.sim.spriced.data.service;

import java.util.List;

import com.sim.spriced.framework.models.BulkEntityDetails;

public interface IBulkProcessService {
	
	public BulkEntityDetails uploadFileDetails(BulkEntityDetails fileDetails);
	
	public BulkEntityDetails updateBulkFileStatus(BulkEntityDetails fileDetails);
	
	public BulkEntityDetails getFileDetails(int id);
	
	public List<BulkEntityDetails> getAllDetails();
	
	public void deleteBulkEntityDetails(int id);
	
}
