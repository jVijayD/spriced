package com.sim.spriced.data.api.controllers;

import java.io.IOException;
import java.util.concurrent.ExecutionException;

import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sim.spriced.data.api.dto.FileDto;
import com.sim.spriced.data.api.dto.mapper.FileDtoMapper;
import com.sim.spriced.data.service.IBulkUploadService;
import com.sim.spriced.framework.models.BulkEntityDetails;

import io.micrometer.core.annotation.Timed;

@RestController()
@RequestMapping("/bulk")
@CrossOrigin(origins = "*")
public class BulkUploadController {

	@Autowired
	private IBulkUploadService bulkUploadService;

	@Autowired
	private FileDtoMapper mapper;
	
	
	@Timed(value = "data.getAll.time", description = "Time taken to upload file")
	@PostMapping(path="/upload",consumes = MediaType.MULTIPART_FORM_DATA_VALUE )
	public ResponseEntity<FileDto> upload(@RequestPart("file") MultipartFile file,@RequestPart("fileDetails") FileDto fileDetails)
			throws ExecutionException, IOException, ParseException {
		BulkEntityDetails bulkEntity = mapper.toBulkEntityDetails(fileDetails);
		return new ResponseEntity<>(mapper.toFileDto(bulkUploadService.uploadFileDetails(bulkEntity, file)),
				HttpStatus.OK);
	}
}
