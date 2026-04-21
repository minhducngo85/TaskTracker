package com.minhduc.tasktracker.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
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
		return authService.login(request);
	}
	
	@PostMapping("/refresh")
	public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
		log.info("Refresh token called!");
		String refreshToken = request.get("refreshToken");
	    String newAccessToken = authService.refreshToken(refreshToken);
	    log.info("Return OK");
	    return ResponseEntity.ok(Map.of("token", newAccessToken));
	}
}
