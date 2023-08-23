package com.sim.spriced.user.access.api.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sim.spriced.user.access.service.IRoleManagementService;

@RestController
@RequestMapping("/user-access/roles")
@CrossOrigin(origins = "*")
public class RoleManagementController {
	
	@Autowired
	IRoleManagementService roleService;
	
	@GetMapping()
	ResponseEntity<List<String>> get() {
		return new ResponseEntity<>(this.roleService.getRoles(), HttpStatus.OK);
	}

}
