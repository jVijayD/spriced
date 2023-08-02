package com.sim.spriced.data.service.impl;

import java.io.File;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sim.spriced.data.service.IFileProcessService;
import com.sim.spriced.data.service.IFileService;
import com.sim.spriced.enums.FileUploadStatus;
import com.sim.spriced.framework.models.FileEntity;

@Service
public class FileUploadService implements IFileService {

	@Autowired
	private IFileProcessService fileProcessService;

	@Value("${connect.input.mount.path}")
	private String dir;

	@Override
	public FileEntity uploadFileDetails(FileEntity fileEntity, MultipartFile file) {
		String status = uploadCsvFiles(file, fileEntity);
		fileEntity.setStatus(status);
		return fileProcessService.uploadFileDetails(fileEntity);
	}

	public String uploadCsvFiles(MultipartFile file,FileEntity data ) {
		String fileName = file.getOriginalFilename();
		String filePath = dir + fileName;
		data.setFilePath(filePath);
		try {
			File destFile = new File(filePath);
			file.transferTo(destFile);
			return FileUploadStatus.NEW_FILE.name();
		} catch (IOException e) {
			e.printStackTrace();
			return FileUploadStatus.UPLOAD_FAILED.name();
		}
	}
}
