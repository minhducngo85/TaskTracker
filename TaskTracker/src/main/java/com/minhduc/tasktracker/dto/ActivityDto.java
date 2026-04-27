package com.minhduc.tasktracker.dto;

import java.time.Instant;

import lombok.Data;

@Data
public class ActivityDto {
    	private Long id;
	private Long taskId;
	private String taskTitle;
	
	private String action; // STATUS_CHANGED, PRIORITY_CHANGED...
	private String message; // Human readable

	private String user;
	private Instant createdAt;

	public ActivityDto(Long taskId, String taskTitle, String action, String message, String user, Instant createdAt) {
		this.taskId = taskId;
		this.taskTitle = taskTitle;
		this.action = action;
		this.message = message;
		this.user = user;
		this.createdAt = createdAt;
	}
}
