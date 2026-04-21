package com.minhduc.tasktracker.entity;

import java.time.Instant;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Data;
import lombok.ToString;

@Entity
@Data
@ToString(exclude = {"description"})
public class Task {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String title;
	private String description;

	@Enumerated(EnumType.STRING)
	private TaskStatus status;
	
	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private TaskPriority priority = TaskPriority.MEDIUM;

	private String assignedTo;
	
	@Column(updatable = false)
	private Instant createdAt;
	
	private Instant updatedAt;
	
	
	@PrePersist
	public void prePersist() {
	    if (this.priority == null) {
	        this.priority = TaskPriority.MEDIUM;
	    }
	    this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
	}
	
	@PreUpdate
	public void preUpdate() {
		this.updatedAt = Instant.now();
	}
}
