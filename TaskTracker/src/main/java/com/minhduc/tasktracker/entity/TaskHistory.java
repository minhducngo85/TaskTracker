package com.minhduc.tasktracker.entity;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

/**
 * Bets practtice for hsitory: use task id instead of @MantoOne to make it easy
 */
@Entity
@Data
public class TaskHistory {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Long taskId;

	private String field; // title, status, priority...

	private String oldValue;

	private String newValue;

	private String changedBy;
	private String changedByFullName;

	private Instant changedAt;
}
