package com.sim.spriced.data.service;

import org.springframework.web.multipart.MultipartFile;

import com.sim.spriced.framework.models.FileEntity;

public interface IFileService {

	public FileEntity uploadFileDetails(FileEntity fileDetails, MultipartFile file);

}
