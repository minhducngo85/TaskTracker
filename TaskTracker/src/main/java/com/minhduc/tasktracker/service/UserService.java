package com.minhduc.tasktracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.minhduc.tasktracker.entity.User;
import com.minhduc.tasktracker.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
 private final UserRepository userRepository;
 
 /**
	 * @return
	 * all task form db
	 */
	public List<User> getAll(){
		return userRepository.findAll();
	}
}
