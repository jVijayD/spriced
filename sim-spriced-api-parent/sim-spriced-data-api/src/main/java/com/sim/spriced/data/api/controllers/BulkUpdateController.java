package com.sim.spriced.data.api.controllers;

import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sim.spriced.data.api.dto.BulkEntityDto;
import com.sim.spriced.data.api.dto.mapper.BulkEntityDtoMapper;
import com.sim.spriced.data.service.IBulkProcessService;
import com.sim.spriced.framework.models.BulkEntityDetails;

import io.micrometer.core.annotation.Timed;

@RestController()
@RequestMapping("/bulk")
@CrossOrigin(origins = "*")
public class BulkUpdateController {


	@Autowired
	private IBulkProcessService processService;

	@Autowired
	private BulkEntityDtoMapper mapper;

	@Timed(value = "data.getAll.time", description = "Time taken to get All file")
	@GetMapping("/getAll")
	public ResponseEntity<List<BulkEntityDto>> getALL() {
		return new ResponseEntity<>(mapper.toFileDtoList(processService.getAllDetails()), HttpStatus.OK);

	}

	@Timed(value = "data.getAll.time", description = "Time taken to get file")
	@GetMapping("/{id}")
	public ResponseEntity<BulkEntityDto> getById(@PathVariable int id) {
		return new ResponseEntity<>(mapper.toBulkEntityDto(processService.getFileDetails(id)), HttpStatus.OK);
	}

	@Timed(value = "data.getAll.time", description = "Time taken to update file")
	@PutMapping("/update")
	public ResponseEntity<BulkEntityDto> updateFile(@RequestBody BulkEntityDto fileDto) throws ExecutionException {
		BulkEntityDetails bulkEntityDetails = processService.getFileDetails(fileDto.getId());
		bulkEntityDetails.setStatus(fileDto.getStatus());
		return new ResponseEntity<>(mapper.toBulkEntityDto(processService.updateBulkFileStatus(bulkEntityDetails)),HttpStatus.OK);
	}
	@Timed(value = "data.getAll.time", description = "Time taken to get file")
	@DeleteMapping("/delete/{id}")
	public void delete(@PathVariable int id) {
		processService.deleteBulkEntityDetails(id);
	}
}
