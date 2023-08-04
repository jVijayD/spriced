package com.sim.spriced.data.api.controllers;

import java.util.concurrent.ExecutionException;

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

import com.sim.spriced.data.api.dto.BulkEntityDto;
import com.sim.spriced.data.api.dto.mapper.BulkEntityDtoMapper;
import com.sim.spriced.data.service.IBulkUploadService;
import com.sim.spriced.framework.models.BulkEntityDetails;

import io.micrometer.core.annotation.Timed;

@RestController()
@RequestMapping("/bulk")
@CrossOrigin(origins = "*")
public class BulkUploadController {

	@Autowired
	private IBulkUploadService uploadService;

	@Autowired
	private BulkEntityDtoMapper mapper;

	@Timed(value = "data.getAll.time", description = "Time taken to upload file")
	@PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<BulkEntityDto> upload(@RequestPart("file") MultipartFile file,
			@RequestPart("fileDetails") BulkEntityDto fileDetails) throws ExecutionException {
		BulkEntityDetails bulkEntity = mapper.toBulkEntityDetails(fileDetails);
		return new ResponseEntity<>(mapper.toBulkEntityDto(uploadService.uploadFileDetails(bulkEntity, file)),
				HttpStatus.OK);
	}
}
