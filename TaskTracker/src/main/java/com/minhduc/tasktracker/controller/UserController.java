package com.minhduc.tasktracker.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minhduc.tasktracker.entity.User;
import com.minhduc.tasktracker.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
@RestController
@RequestMapping("api/admin/users")
@RequiredArgsConstructor
public class UserController {
  private final UserService userService;
	
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping
	public List<User> getAllUsers() {
	    return userService.getAll();
	}
}
