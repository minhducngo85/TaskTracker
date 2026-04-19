package com.minhduc.tasktracker.repository;

import org.springframework.stereotype.Repository;

import com.minhduc.tasktracker.entity.Task;
import com.minhduc.tasktracker.entity.TaskPriority;
import com.minhduc.tasktracker.entity.TaskStatus;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
	List<Task> findByStatus(TaskStatus status);
	List<Task> findByPriority(TaskPriority priority);
}
