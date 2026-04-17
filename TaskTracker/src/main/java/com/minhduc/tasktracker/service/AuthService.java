package com.minhduc.tasktracker.service;

import org.springframework.stereotype.Service;

import com.minhduc.tasktracker.controller.exceptionhandling.InvalidCredentialsException;
import com.minhduc.tasktracker.controller.exceptionhandling.ResourceNotFoundException;
import com.minhduc.tasktracker.dto.LoginRequest;
import com.minhduc.tasktracker.entity.User;
import com.minhduc.tasktracker.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
  private final UserRepository userRepository;
  private final JwtService jwtService;
  
  public String login(LoginRequest request) {
	  log.info("Received login request");
	  User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new ResourceNotFoundException("User not found!"));
	  
	  //  (demo)
	  // Productive: use BCryptPasswordEncoder
      if (!user.getPassword().equals(request.getPassword())) {
    	  throw new InvalidCredentialsException("Invalid username or password");
      }
      return jwtService.generateToken(user);
  }
}
