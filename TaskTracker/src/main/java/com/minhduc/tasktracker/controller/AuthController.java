package com.minhduc.tasktracker.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minhduc.tasktracker.dto.LoginRequest;
import com.minhduc.tasktracker.dto.LoginResponse;
import com.minhduc.tasktracker.service.AuthService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
	private final AuthService authService;

	@PostMapping("/login")
	public LoginResponse login(@RequestBody LoginRequest request) {
		log.info("Login called!");
		String token = authService.login(request);
		return new LoginResponse(token);
	}
}
