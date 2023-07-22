package com.sim.spriced.data.api.controllers;

import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sim.spriced.data.api.dto.SettingsDto;
import com.sim.spriced.data.api.dto.mapper.SettingsDtoMapper;
import com.sim.spriced.data.service.ISettingsService;
import com.sim.spriced.framework.models.Settings;

import io.micrometer.core.annotation.Timed;



@RestController()
@RequestMapping("/settings")
@CrossOrigin(origins = "*")
public class SettingsController {
	
	@Autowired
	private ISettingsService settingsService;
	
	@Autowired
	private SettingsDtoMapper mapper;
	
	
	@Timed(value = "data.getAll.time", description = "Time taken to return all settings")
	@GetMapping("/get")
	public ResponseEntity<SettingsDto> get()
			throws InterruptedException, ExecutionException {
		return new ResponseEntity<>(mapper.toSettingsDto(this.settingsService.getSettings()), HttpStatus.OK);

	
	}
	
	@Timed(value = "data.getAll.time", description = "Time taken to create or add settings")
	@PostMapping("/add")
	public ResponseEntity<SettingsDto> addSettings( @RequestBody SettingsDto settingsDto)
			throws InterruptedException, ExecutionException {
		Settings data= mapper.toSettings(settingsDto);
		return new ResponseEntity<>(mapper.toSettingsDto(this.settingsService.addSettings(data)), HttpStatus.OK);

	}
	
	@Timed(value = "data.getAll.time", description = "Time taken to update settings")
	@PutMapping("/update")
	public ResponseEntity<SettingsDto> updateSettings( @RequestBody  SettingsDto settingsDto)
			throws InterruptedException, ExecutionException {
		Settings data= mapper.toSettings(settingsDto);
		return new ResponseEntity<>(mapper.toSettingsDto(this.settingsService.updateSettings(data)), HttpStatus.OK);

	}
	
	@Timed(value = "data.getAll.time", description = "Time taken to deleten user settings")
	@DeleteMapping("/delete")
	public void deleteSettings()
			throws InterruptedException, ExecutionException {
	 settingsService.deleteSettings();
	
	}
}
