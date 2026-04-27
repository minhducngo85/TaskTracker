package com.minhduc.tasktracker.dto;

import java.time.Instant;

import lombok.Data;

@Data
public class ActivityProjection {
        private Long id;
	private Long taskId;
	private String taskTitle;

	private String field;
	private String oldValue;
	private String newValue;

	private String user;
	private String changedByFullName;
	private Instant createdAt;

	public ActivityProjection(Long id, Long taskId, String taskTitle, String field, String oldValue, String newValue,
			String user, String changedByFullName, Instant createdAt) {
		this.id = id;
	    this.taskId = taskId;
		this.taskTitle = taskTitle;
		this.field = field;
		this.oldValue = oldValue;
		this.newValue = newValue;
		this.user = user;
		this.changedByFullName = changedByFullName;
		this.createdAt = createdAt;
	}
}
