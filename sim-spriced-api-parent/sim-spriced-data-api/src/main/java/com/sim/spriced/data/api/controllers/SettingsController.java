package com.sim.spriced.data.api.controllers;

import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sim.spriced.data.service.ISettingsService;
import com.sim.spriced.framework.models.Settings;
import com.sim.spriced.framework.models.SettingsData;

import io.micrometer.core.annotation.Timed;



@RestController()
@RequestMapping("/settings")
@CrossOrigin(origins = "*")
public class SettingsController {
	
	@Autowired
	private ISettingsService settingsService;
	
	@Timed(value = "data.getAll.time", description = "Time taken to return all settings")
	@GetMapping("/get")
	public Settings getSettings()
			throws InterruptedException, ExecutionException {
	return settingsService.getSettings();
	
	}
	
	@Timed(value = "data.getAll.time", description = "Time taken to create or add settings")
	@PostMapping("/add")
	public Settings addSettings( @RequestBody SettingsData data)
			throws InterruptedException, ExecutionException {
		
	return settingsService.addSettings( data);
	}
	
	@Timed(value = "data.getAll.time", description = "Time taken to update settings")
	@PutMapping("/update")
	public Settings updateSettings( @RequestBody SettingsData data)
			throws InterruptedException, ExecutionException {
		return settingsService.updateSettings(data);
	}
	
	@Timed(value = "data.getAll.time", description = "Time taken to deleten user settings")
	@DeleteMapping("/delete")
	public void deleteSettings()
			throws InterruptedException, ExecutionException {
	 settingsService.deleteSettings();
	
	}
}
