package com.minhduc.tasktracker.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.minhduc.tasktracker.dto.ActivityDto;
import com.minhduc.tasktracker.dto.DtoMapper;
import com.minhduc.tasktracker.repository.TaskHistoryRepository;
import com.minhduc.tasktracker.security.SecurityUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ActivityService {
	
	private final TaskHistoryRepository taskHistoryRepository;
	
	/**
	 * to get list of activities
	 * 
	 * @param taskId
	 * @return
	 */
	public Page<ActivityDto> getActivities(int page, int size) {
		if (page < 0)
			page = 0;
		if (size <= 0 || size > 50)
			size = 10; // 

		Page<ActivityDto> activities = taskHistoryRepository.findAllActivities(
				PageRequest.of(page, size, Sort.by("changedAt").descending())).map(DtoMapper::mapToActivityDto);
		return activities;
	}
	
	
	/**
	 * to get list of activities of current user
	 * 
	 * @param taskId
	 * @return
	 */
	public Page<ActivityDto> getMyActivities(int page, int size) {
		if (page < 0)
			page = 0;
		if (size <= 0 || size > 50)
			size = 10; // 

		Page<ActivityDto> activities = taskHistoryRepository.findAllActivities(SecurityUtils.getCurrentUser(),
				PageRequest.of(page, size, Sort.by("changedAt").descending())).map(DtoMapper::mapToActivityDto);
		return activities;
	}
}
