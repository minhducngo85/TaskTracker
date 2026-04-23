package com.minhduc.tasktracker.entity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.ToString;

@Entity
@Data
@ToString(exclude = { "description","comments"  })
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

	@ElementCollection
	@CollectionTable(name = "task_tags", joinColumns = @JoinColumn(name = "task_id"))
	@Column(name = "tag")
	private List<String> tags = new ArrayList<>();
	
	@OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference // ignore json loop if it is used as DTO
	private List<TaskComment> comments = new ArrayList<>();

	/** duplicate tag */
	public void setTags(List<String> tags) {
		if (tags == null) {
			this.tags = new ArrayList<>();
			return;
		}
		this.tags = tags.stream().map(String::trim).map(String::toLowerCase).distinct().toList();
	}

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
