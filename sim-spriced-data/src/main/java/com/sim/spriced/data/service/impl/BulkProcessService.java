package com.sim.spriced.data.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sim.spriced.data.repo.IBulkProcessRepo;
import com.sim.spriced.data.service.IBulkProcessService;
import com.sim.spriced.framework.models.BulkEntityDetails;

@Service
public class BulkProcessService implements IBulkProcessService {

	@Autowired
	IBulkProcessRepo bulkProcessRepo;

	public BulkEntityDetails uploadFileDetails(BulkEntityDetails bulkEntityDetails) {
		return bulkProcessRepo.saveFileDetails(bulkEntityDetails);
	}

	@Override
	public BulkEntityDetails getFileDetails(int id) {
		BulkEntityDetails bulkEntityDetails = new BulkEntityDetails();
		bulkEntityDetails.setId(id);
		return bulkProcessRepo.getUpdateDetails(bulkEntityDetails);
	}

	@Override
	public List<BulkEntityDetails> getAllDetails() {
		// TODO Auto-generated method stub
		return bulkProcessRepo.getUpdateDetails();
	}

	@Override
	public BulkEntityDetails updateBulkFileStatus(BulkEntityDetails fileDetails) {
		// TODO Auto-generated method stub
		return bulkProcessRepo.updateBulkUploadDetails(fileDetails);
	}

	@Override
	public void deleteBulkEntityDetails(int id) {
		BulkEntityDetails bulkEntityDetails = new BulkEntityDetails();
		bulkEntityDetails.setId(id);
		bulkProcessRepo.deleteBulkUpdateDetails(bulkEntityDetails);
	}

}
