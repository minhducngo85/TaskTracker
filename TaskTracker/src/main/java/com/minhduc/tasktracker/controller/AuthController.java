package com.minhduc.tasktracker.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minhduc.tasktracker.dto.LoginRequest;
import com.minhduc.tasktracker.dto.LoginResponse;
import com.minhduc.tasktracker.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
	private final AuthService authService;

	@PostMapping("/login")
	public LoginResponse login(@RequestBody LoginRequest request) {
		String token = authService.login(request);
		return new LoginResponse(token);
	}
}
