package com.sim.spriced.user.access.api.controllers;

import java.util.Date;
import java.util.List;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sim.spriced.user.access.api.dto.HelpAccessDto;


@RestController
@RequestMapping("/help-access")
@CrossOrigin(origins = "*")
public class HelpAccessController {

	//@Value("${jwt.secret}")
	//private String secret;
	
	@Value("${help.domain}")
	private String helpDomain;
	
	@Value("${help.expiration}")
	private int expiration;
	
	@PostMapping()
	ResponseEntity<Boolean> helpAccess(@RequestBody HelpAccessDto requestDto){

		ResponseCookie springCookie = ResponseCookie.from("access-token", "spriced-help-access")
			    .httpOnly(true)
			    .secure(true)
			    .path("/")
			    .maxAge(expiration)
			    .domain(helpDomain)
			    .build();
		
		 return ResponseEntity
		    .ok()
		    .header(HttpHeaders.SET_COOKIE, springCookie.toString())
		    .body(true);
		
	}
	
}
