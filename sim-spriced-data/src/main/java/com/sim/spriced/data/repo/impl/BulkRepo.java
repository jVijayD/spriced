package com.sim.spriced.data.repo.impl;

import org.springframework.stereotype.Repository;

import com.sim.spriced.data.repo.IDataFileRepo;
import com.sim.spriced.framework.models.FileEntity;
import com.sim.spriced.framework.repo.BaseRepo;


@Repository
public class FileUploadRepo extends BaseRepo implements IDataFileRepo {

	@Override
	public FileEntity saveFileDetails(FileEntity fileEntity) {
		return super.create(fileEntity);
	}
}
