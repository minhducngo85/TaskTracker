package com.minhduc.tasktracker.service;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minhduc.tasktracker.controller.exceptionhandling.ResourceNotFoundException;
import com.minhduc.tasktracker.dto.TagCount;
import com.minhduc.tasktracker.dto.TaskCommentDTO;
import com.minhduc.tasktracker.dto.TaskFilterRequest;
import com.minhduc.tasktracker.dto.TaskStatisticsResponse;
import com.minhduc.tasktracker.entity.Task;
import com.minhduc.tasktracker.entity.TaskComment;
import com.minhduc.tasktracker.entity.TaskHistory;
import com.minhduc.tasktracker.entity.TaskPriority;
import com.minhduc.tasktracker.entity.TaskStatus;
import com.minhduc.tasktracker.entity.User;
import com.minhduc.tasktracker.repository.TaskHistoryRepository;
import com.minhduc.tasktracker.repository.TaskRepository;
import com.minhduc.tasktracker.repository.UserRepository;
import com.minhduc.tasktracker.security.SecurityUtils;
import com.minhduc.tasktracker.specification.TaskSpecification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskService {
	private final TaskRepository taskRepository;
	private final TaskHistoryRepository taskHistoryRepository;
	private final UserRepository userRepo;

	/**
	 * @return all task form db
	 */
	public List<Task> getAll() {
		return taskRepository.findAll(Sort.by("createdAt").descending());
	}

	public TaskStatisticsResponse getStatistics() {
		TaskStatisticsResponse stats = new TaskStatisticsResponse();
		stats.setTotal(taskRepository.count());
		stats.setCritical(taskRepository.countByPriority(TaskPriority.CRITICAL));
		stats.setHigh(taskRepository.countByPriority(TaskPriority.HIGH));
		stats.setMedium(taskRepository.countByPriority(TaskPriority.MEDIUM));
		stats.setLow(taskRepository.countByPriority(TaskPriority.LOW));

		stats.setTodo(taskRepository.countByStatus(TaskStatus.TODO));
		stats.setInProgress(taskRepository.countByStatus(TaskStatus.IN_PROGRESS));
		stats.setDone(taskRepository.countByStatus(TaskStatus.DONE));

		return stats;
	}

	/**
	 * 
	 * @param filter
	 * @param page
	 * @param size
	 * @param sort
	 * @return
	 */
	public Page<Task> getTasks(TaskFilterRequest filter, int page, int size, String[] sort) {

		// ✅ parse sort
		String sortField = sort[0];
		String sortDir = sort.length > 1 ? sort[1] : "asc";

		Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;

		Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));

		// Call repository
		return taskRepository.findAll(TaskSpecification.filter(filter), pageable);
	}

	/**
	 * to create a task and save into db
	 * 
	 * @param task
	 * @return
	 */
	public Task create(Task task) {
		task.setStatus(TaskStatus.TODO);
		return taskRepository.save(task);
	}

	/**
	 * to update an entry
	 * 
	 * @param id
	 * @param updated
	 * @return
	 */
	@Transactional
	public Task update(Long id, Task updated) {
		log.info("Updated Req={}", updated.toString());
		Task task = taskRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

		// save change history
		if (!Objects.equals(task.getTitle(), updated.getTitle())) {
			saveHistory(task.getId(), "title", task.getTitle(), updated.getTitle());
		}
		
		if (!Objects.equals(task.getDescription(), updated.getDescription())) {
			saveHistory(task.getId(), "description", task.getDescription(), updated.getDescription());
		}
		
		if (!Objects.equals(task.getStatus(), updated.getStatus())) {
			saveHistory(task.getId(), "status", task.getStatus().name(), updated.getStatus().name());
		}
		if (!Objects.equals(task.getPriority(), updated.getPriority())) {
			saveHistory(task.getId(), "priority", String.valueOf(task.getPriority()),
					String.valueOf(updated.getPriority()));
		}
		if (!Objects.equals(task.getAssignedTo(), updated.getAssignedTo())) {
			saveHistory(task.getId(), "assignedTo", task.getAssignedTo(), updated.getAssignedTo());
		}
		String oldTags = String.join(",", task.getTags());
		String newTags = updated.getTags() != null ? String.join(",", updated.getTags()) : "";
		if (!Objects.equals(oldTags, newTags)) {
			saveHistory(task.getId(), "tags", oldTags, newTags);
		}

		// update obj
		task.setTitle(updated.getTitle());
		task.setAssignedTo(updated.getAssignedTo());
		task.setDescription(updated.getDescription());
		task.setStatus(updated.getStatus());
		task.setPriority(updated.getPriority());
		task.setUpdatedAt(Instant.now());
		task.getTags().clear();
		if (updated.getTags() != null) {
			task.getTags().addAll(updated.getTags());
		}
		Task updatedObj = taskRepository.save(task);

		log.info("Updated Res={}", updatedObj.toString());

		return updatedObj;
	}

	public void delete(Long id) {
		taskRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
		taskRepository.deleteById(id);
	}

	public List<Task> findByPriority(TaskPriority priority) {
		return taskRepository.findByPriority(priority);
	}

	public Task getTask(long id) {
		Task task = taskRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
		return task;
	}

	public List<String> getAllTags() {
		return taskRepository.findAllUniqueTags();
	}

	public List<TagCount> getTopTags() {
		return taskRepository.findTopTags().stream().map(obj -> new TagCount((String) obj[0], (Long) obj[1])).toList();
	}

	/**
	 * helper method to save history
	 * 
	 * @param taskId
	 * @param field
	 * @param oldVal
	 * @param newVal
	 */
	private void saveHistory(Long taskId, String field, String oldVal, String newVal) {
		TaskHistory h = new TaskHistory();
		h.setTaskId(taskId);
		h.setField(field);
		h.setOldValue(oldVal);
		h.setNewValue(newVal);
		h.setChangedBy(SecurityUtils.getCurrentUser());
		String fullName = userRepo.findByUsername(SecurityUtils.getCurrentUser()).map(User::getFullname).orElse(SecurityUtils.getCurrentUser());
		h.setChangedByFullName(fullName);
		h.setChangedAt(Instant.now());
		taskHistoryRepository.save(h);
	}
	
	/**
	 * to get list of comments by task id
	 * 
	 * @param taskId
	 * @return
	 */
	public Page<TaskHistory> getHistory(long taskId, int page, int size) {
		if (page < 0) page = 0;
	    if (size <= 0 || size > 50) size = 10; // tránh query quá lớn
	    
		Page<TaskHistory> history = taskHistoryRepository.findByTaskIdOrderByChangedAtDesc(taskId, PageRequest.of(page, size));
		return history;
	}
}
