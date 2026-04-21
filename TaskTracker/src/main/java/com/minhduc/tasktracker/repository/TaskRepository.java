package com.minhduc.tasktracker.repository;

import org.springframework.stereotype.Repository;

import com.minhduc.tasktracker.entity.Task;
import com.minhduc.tasktracker.entity.TaskPriority;
import com.minhduc.tasktracker.entity.TaskStatus;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {
	List<Task> findByStatus(TaskStatus status);
	List<Task> findByPriority(TaskPriority priority);
	long count();
    long countByStatus(TaskStatus status);
    long countByPriority(TaskPriority priority);
}
