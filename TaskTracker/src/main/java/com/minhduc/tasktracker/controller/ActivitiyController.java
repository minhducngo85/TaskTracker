package com.minhduc.tasktracker.controller;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.minhduc.tasktracker.dto.ActivityDto;
import com.minhduc.tasktracker.service.ActivityService;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
@RestController
@RequestMapping("api/activities")
@RequiredArgsConstructor
public class ActivitiyController {

	private final ActivityService activityService;

	@GetMapping
	public Page<ActivityDto> getActivities(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		return activityService.getActivities(page, size);
	}
}
