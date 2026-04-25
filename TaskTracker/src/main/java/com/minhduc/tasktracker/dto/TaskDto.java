package com.minhduc.tasktracker.dto;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.minhduc.tasktracker.entity.TaskPriority;
import com.minhduc.tasktracker.entity.TaskStatus;

import lombok.Data;

@Data
public class TaskDto {
	private Long id;
	private String title;
	private String description;
	private TaskStatus status;
	private TaskPriority priority;
	private String assignedTo;
	private Instant dueDate;
	private Instant createdAt;
	private Instant updatedAt;
	private List<String> tags = new ArrayList<>();
}
