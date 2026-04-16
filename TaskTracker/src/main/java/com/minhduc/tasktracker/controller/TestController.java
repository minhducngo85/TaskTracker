package com.minhduc.tasktracker.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("api/test")
@RequiredArgsConstructor
public class TestController {

	@GetMapping
	public String test() {
		log.info("test() called");
		return "Hello World!";
	}
}
