package com.minhduc.tasktracker.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.minhduc.tasktracker.dto.ActivityProjection;
import com.minhduc.tasktracker.entity.TaskHistory;


public interface TaskHistoryRepository extends JpaRepository<TaskHistory, Long> {
	Page<TaskHistory> findByTaskIdOrderByChangedAtDesc(Long taskId, Pageable pageable);
	
	@Query("""
		    SELECT new com.minhduc.tasktracker.dto.ActivityProjection(
		        h.taskId,
		        t.title,
		        h.field,
		        h.oldValue,
		        h.newValue,
		        h.changedBy,
		        h.changedByFullName,
		        h.changedAt
		    )
		    FROM TaskHistory h
		    JOIN Task t ON h.taskId = t.id
		    ORDER BY h.changedAt DESC
		""")
	 Page<ActivityProjection> findAllActivities(Pageable pageable);
	
	@Query("""
		    SELECT new com.minhduc.tasktracker.dto.ActivityProjection(
		        h.taskId,
		        t.title,
		        h.field,
		        h.oldValue,
		        h.newValue,
		        h.changedBy,
		        h.changedByFullName,
		        h.changedAt
		    )
		    FROM TaskHistory h
		    JOIN Task t ON h.taskId = t.id
		    WHERE h.changedBy = :username
		    ORDER BY h.changedAt DESC
		""")
	 Page<ActivityProjection> findAllActivities(String username, Pageable pageable);
}
