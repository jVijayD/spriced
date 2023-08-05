package com.sim.spriced.data.repo.impl;

import com.sim.spriced.framework.models.BulkEntityDetails;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.sim.spriced.data.repo.IBulkProcessRepo;
import com.sim.spriced.framework.repo.BaseRepo;

@Repository
public class BulkRepo extends BaseRepo implements IBulkProcessRepo {

	@Override
	public BulkEntityDetails saveFileDetails(BulkEntityDetails bulkEntityDetails) {
		return super.create(bulkEntityDetails);
	}

	@Override
	public BulkEntityDetails updateBulkUploadDetails(BulkEntityDetails bulkEntityDetails) {

		return super.update(bulkEntityDetails);
	}

	@Override
	public List<BulkEntityDetails> getUpdateDetails() {

		return super.fetchAll("bulk_upload_details", null, BulkEntityDetails.class);
	}

	@Override
	public BulkEntityDetails getUpdateDetails(BulkEntityDetails bulkEntityDetails) {

		return super.fetchOne(bulkEntityDetails);
	}

	@Override
	public void deleteBulkUpdateDetails(BulkEntityDetails bulkEntityDetails) {
		super.delete(bulkEntityDetails);
	}

}
