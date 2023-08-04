package com.sim.spriced.data.repo.impl;

import com.sim.spriced.framework.models.BulkEntityDetails;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.sim.spriced.data.repo.IBulkProcessRepo;
import com.sim.spriced.framework.repo.BaseRepo;


@Repository
public class BulkRepo extends BaseRepo implements IBulkProcessRepo{

	@Override
	public BulkEntityDetails saveFileDetails(BulkEntityDetails bulkEntityDetails) {
		return super.create(bulkEntityDetails);
	}

}
