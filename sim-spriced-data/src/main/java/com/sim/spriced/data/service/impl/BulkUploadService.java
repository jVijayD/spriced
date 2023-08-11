package com.sim.spriced.data.service.impl;


import java.io.File;
import java.io.IOException;
import java.util.Date;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sim.spriced.data.repo.IBulkProcessRepo;
import com.sim.spriced.data.service.IBulkUploadService;
import com.sim.spriced.enums.BulkUploadStatus;
import com.sim.spriced.framework.models.BulkEntityDetails;

@Service
public class BulkUploadService implements IBulkUploadService {

	
	@Autowired
	private IBulkProcessRepo processRepo;

	@Value("${connect.input.mount.path}")
	private String dir;

	@Override
	public BulkEntityDetails uploadFileDetails(BulkEntityDetails fileEntity, MultipartFile file) {
		String status = uploadCsvFiles(file, fileEntity);
		fileEntity.setStatus(status);
		return processRepo.saveFileDetails(fileEntity);
	}

	public String uploadCsvFiles(MultipartFile file, BulkEntityDetails data ) {
		String entity= data.getEntityName()+"_"+Long.toString(new Date().getTime());
		String ext= StringUtils.substringAfter(file.getOriginalFilename(),".");
		String newFileName = entity+"."+ext;
		String filePath = dir + newFileName;
		data.setFilePath(filePath);
		data.setEntityName(newFileName);
		try {
			File destFile = new File(filePath);
			destFile.createNewFile();
			file.transferTo(destFile);
			return BulkUploadStatus.UPLOADED.getBulkUploadStatus();
		} catch (IOException e) {
			e.printStackTrace();
			return BulkUploadStatus.UPLOAD_FAILED.getBulkUploadStatus();
		}
	}
}
