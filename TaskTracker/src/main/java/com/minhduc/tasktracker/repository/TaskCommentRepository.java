package com.minhduc.tasktracker.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.minhduc.tasktracker.entity.TaskComment;

public interface TaskCommentRepository extends JpaRepository<TaskComment, Long> {
	Page<TaskComment> findByTaskIdOrderByCreatedAtDesc(Long taskId, Pageable pageable);
}
