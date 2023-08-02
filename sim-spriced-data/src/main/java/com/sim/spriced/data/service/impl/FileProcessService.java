package com.sim.spriced.data.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sim.spriced.data.repo.IDataFileRepo;
import com.sim.spriced.data.service.IFileProcessService;
import com.sim.spriced.framework.models.FileEntity;

@Service
public class FileProcessService implements IFileProcessService {
	
	@Autowired
	IDataFileRepo fileRepo;

	public FileEntity uploadFileDetails(FileEntity fileEntity) {
	return fileRepo.saveFileDetails(fileEntity);
	}
}
