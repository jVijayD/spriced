package com.sim.spriced.data.api.controllers;

import java.io.IOException;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sim.spriced.data.api.dto.FileDto;
import com.sim.spriced.data.api.dto.mapper.FileDtoMapper;
import com.sim.spriced.data.service.IFileService;
import com.sim.spriced.framework.models.FileEntity;

import io.micrometer.core.annotation.Timed;

@RestController()
@RequestMapping("/file")
@CrossOrigin(origins = "*")
public class FileUploadController {

	@Autowired
	private IFileService fileService;

	@Autowired
	private FileDtoMapper mapper;

	@Timed(value = "data.getAll.time", description = "Time taken to return all settings")
	@GetMapping("/upload")
	public ResponseEntity<FileDto> upload(@RequestParam("file") MultipartFile file, @RequestParam String source,
			@RequestParam String entityName) throws InterruptedException, ExecutionException, IOException {

		FileDto fileDto = new FileDto();
		fileDto.setEntityName(entityName);
		fileDto.setSource(source);
		FileEntity fileEntity = mapper.toFileEntity(fileDto);
		return new ResponseEntity<>(mapper.toFileDto(fileService.uploadFileDetails(fileEntity, file)), HttpStatus.OK);
	}
}
