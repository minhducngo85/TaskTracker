package com.minhduc.tasktracker.dto;

import java.time.Instant;

import lombok.Data;

@Data
public class TaskCommentDTO {
	private Long id;
	private String content;
	private String createdBy;
	private String createdByFullName;
	private Instant createdAt;
	private Instant updatedAt;
}
