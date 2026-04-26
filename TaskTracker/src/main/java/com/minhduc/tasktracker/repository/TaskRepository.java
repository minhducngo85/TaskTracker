package com.minhduc.tasktracker.repository;

import org.springframework.stereotype.Repository;

import com.minhduc.tasktracker.entity.Task;
import com.minhduc.tasktracker.entity.TaskPriority;
import com.minhduc.tasktracker.entity.TaskStatus;

import java.time.Instant;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {

	List<Task> findByStatus(TaskStatus status);

	List<Task> findByPriority(TaskPriority priority);

	long count();

	long countByStatus(TaskStatus status);

	long countByPriority(TaskPriority priority);

	/** native query for better Performance */
	@Query(value = "SELECT DISTINCT tag FROM task_tags", nativeQuery = true)
	List<String> findAllUniqueTags();

	@Query("SELECT t, COUNT(t) FROM Task task JOIN task.tags t GROUP BY t ORDER BY COUNT(t) DESC")
	List<Object[]> findTopTags();

	@Query("SELECT t from Task t WHERE t.assignedTo = :username AND t.status != 'DONE' AND t.dueDate < :now")
	List<Task> findOverdue(String username, Instant now);

	@Query("""
			SELECT t FROM Task t
			WHERE t.assignedTo = :username
			AND t.status <> 'DONE'
			AND t.dueDate >= :start
			AND t.dueDate < :end
			""")
	List<Task> findTaksByDueDate(String username, Instant start, Instant end);

	@Query("""
			SELECT t FROM Task t
			WHERE t.assignedTo = :username
			AND t.status != 'DONE'
			AND t.dueDate BETWEEN :now AND :weekLater
			""")
	List<Task> findDueThisWeek(String username, Instant now, Instant weekLater);
	
	
	List<Task> findByAssignedToAndStatusNot(String assignedTo, TaskStatus status);
	
	@Query("""
			SELECT t FROM Task t
			WHERE t.status = 'DONE'
			AND t.updatedAt >= :start
			ORDER BY t.updatedAt DESC
			""")
	List<Task> findDoneTask(Instant start);
}
