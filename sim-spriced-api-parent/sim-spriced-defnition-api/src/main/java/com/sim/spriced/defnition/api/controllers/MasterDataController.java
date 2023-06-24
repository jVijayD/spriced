package com.sim.spriced.defnition.api.controllers;

import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sim.spriced.defnition.data.service.IMasterDataService;
import com.sim.spriced.framework.annotations.IDType;
import com.sim.spriced.framework.models.AttributeConstants;
import com.sim.spriced.framework.models.Condition;

import io.micrometer.core.annotation.Timed;

@RestController()
@RequestMapping("/master-data")
@CrossOrigin(origins = "*")
public class MasterDataController {

	@Autowired
	IMasterDataService masterDataService;

	@Timed(value = "masterData.getAllDataType.time", description = "Time taken to return all data types.")
	@GetMapping("/data-types")
	public ResponseEntity<Map<AttributeConstants.DataType, String>> getAllDataType() {
		CacheControl cacheControl = CacheControl.maxAge(300, TimeUnit.SECONDS).noTransform().mustRevalidate();
		return ResponseEntity.status(HttpStatus.OK).cacheControl(cacheControl).body(this.masterDataService.getAllDataType());
	}

	@Timed(value = "masterData.getAllType.time", description = "Time taken to return all types.")
	@GetMapping("/types")
	public ResponseEntity<Map<AttributeConstants.Type, String>> getAllType() {
		CacheControl cacheControl = CacheControl.maxAge(300, TimeUnit.SECONDS).noTransform().mustRevalidate();
		return  ResponseEntity.status(HttpStatus.OK).cacheControl(cacheControl).body(this.masterDataService.getAllType());
	}

	@Timed(value = "masterData.getAllConstraintType.time", description = "Time taken to return all constraint types.")
	@GetMapping("/constraint-types")
	public ResponseEntity<Map<AttributeConstants.ConstraintType, String>> getAllConstraintType() {
		CacheControl cacheControl = CacheControl.maxAge(300, TimeUnit.SECONDS).noTransform().mustRevalidate();
		return  ResponseEntity.ok().cacheControl(cacheControl).body(this.masterDataService.getAllConstraintType());
	}

	@Timed(value = "masterData.getAllIdType.time", description = "Time taken to return all id types.")
	@GetMapping("/id-types")
	public ResponseEntity<Map<IDType, String>> getAllIdType() {
		CacheControl cacheControl = CacheControl.maxAge(300, TimeUnit.SECONDS).noTransform().mustRevalidate();
		return  ResponseEntity.ok().cacheControl(cacheControl).body(this.masterDataService.getAllIdType());
	}

	@Timed(value = "masterData.getAllConditionType.time", description = "Time taken to return all condition types.")
	@GetMapping("/condition-types")
	public ResponseEntity<Map<Condition.ConditionType, String>> getAllConditionType() {
		CacheControl cacheControl = CacheControl.maxAge(300, TimeUnit.SECONDS).noTransform().mustRevalidate();
		return  ResponseEntity.ok().cacheControl(cacheControl).body(this.masterDataService.getAllConditionType());
	}

	@Timed(value = "masterData.getAllOperatorType.time", description = "Time taken to return all operator types.")
	@GetMapping("/operator-types")
	public ResponseEntity<Map<Condition.OperatorType, String>> getAllOperatorType() {
		CacheControl cacheControl = CacheControl.maxAge(300, TimeUnit.SECONDS).noTransform().mustRevalidate();
		return ResponseEntity.ok().cacheControl(cacheControl).body(this.masterDataService.getAllOperatorType());
	}

	@Timed(value = "masterData.getAllOperandType.time", description = "Time taken to return all operand types.")
	@GetMapping("/operand-types")
	public ResponseEntity<Map<Condition.OperandType, String>> getAllOperandType() {
		CacheControl cacheControl = CacheControl.maxAge(300, TimeUnit.SECONDS).noTransform().mustRevalidate();
		return  ResponseEntity.ok().cacheControl(cacheControl).body(this.masterDataService.getAllOperandType());
	}

}
