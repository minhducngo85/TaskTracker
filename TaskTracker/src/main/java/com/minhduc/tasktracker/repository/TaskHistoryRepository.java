package com.minhduc.tasktracker.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.minhduc.tasktracker.entity.TaskHistory;


public interface TaskHistoryRepository extends JpaRepository<TaskHistory, Long> {
	Page<TaskHistory> findByTaskIdOrderByChangedAtDesc(Long taskId, Pageable pageable);
}
