package com.minhduc.tasktracker.dto;

import java.time.LocalDate;

import com.minhduc.tasktracker.entity.TaskPriority;
import com.minhduc.tasktracker.entity.TaskStatus;

import lombok.Data;

@Data
public class TaskFilterRequest {
	private String keyword;
	private TaskStatus status;
	private TaskPriority priority;
	private LocalDate fromDate;
	private LocalDate toDate;
	private String assignedTo;
}
