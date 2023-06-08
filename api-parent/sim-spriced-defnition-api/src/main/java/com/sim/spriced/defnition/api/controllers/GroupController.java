package com.sim.spriced.defnition.api.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/models")
public class GroupController {
	@GetMapping()
	public String home() {
		return "Home";
	}
}
