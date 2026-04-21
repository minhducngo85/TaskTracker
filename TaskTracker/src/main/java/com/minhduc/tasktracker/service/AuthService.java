package com.minhduc.tasktracker.service;

import org.springframework.stereotype.Service;

import com.minhduc.tasktracker.controller.exceptionhandling.InvalidCredentialsException;
import com.minhduc.tasktracker.controller.exceptionhandling.ResourceNotFoundException;
import com.minhduc.tasktracker.dto.LoginRequest;
import com.minhduc.tasktracker.dto.LoginResponse;
import com.minhduc.tasktracker.entity.User;
import com.minhduc.tasktracker.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * @author Minh Duc Ngo
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
	private final UserRepository userRepository;
	private final JwtService jwtService;

	/**
	 * to login
	 * 
	 * @param request
	 * @return the access token
	 */
	public LoginResponse login(LoginRequest request) {
		log.info("Received login request");
		User user = userRepository.findByUsername(request.getUsername())
				.orElseThrow(() -> new ResourceNotFoundException("User not found!"));

		// (demo)
		// Productive: use BCryptPasswordEncoder
		if (!user.getPassword().equals(request.getPassword())) {
			throw new InvalidCredentialsException("Invalid username or password");
		}
		String accesstoken = jwtService.generateToken(user);
		String refreshToken = jwtService.generateRefreshToken(user);
		return new LoginResponse(accesstoken, refreshToken);
	}

	/**
	 * refresh the access token
	 * 
	 * @param refreshToken
	 * @return
	 */
	public String refreshToken(String refreshToken) {
		log.info("refreshToken: {}", refreshToken);
		log.info("isTokenValid: {}", jwtService.isTokenValid(refreshToken));
		log.info("isRefreshToken: {}", jwtService.isRefreshToken(refreshToken));
		if (!jwtService.isTokenValid(refreshToken) || !jwtService.isRefreshToken(refreshToken)) {
			throw new InvalidCredentialsException("Refresh token is invalid");
		}
		String username = jwtService.extractUsername(refreshToken);
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new ResourceNotFoundException("User not found!"));
		String newToken= jwtService.generateToken(user);
		return newToken;
	}
}
