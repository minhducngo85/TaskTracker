package com.minhduc.tasktracker.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.minhduc.tasktracker.dto.TagCount;
import com.minhduc.tasktracker.dto.TaskFilterRequest;
import com.minhduc.tasktracker.dto.TaskStatisticsResponse;
import com.minhduc.tasktracker.dto.UserResponse;
import com.minhduc.tasktracker.entity.Task;
import com.minhduc.tasktracker.entity.TaskHistory;
import com.minhduc.tasktracker.entity.TaskPriority;
import com.minhduc.tasktracker.service.TaskService;
import com.minhduc.tasktracker.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
@RestController
@RequestMapping("api/tasks")
@RequiredArgsConstructor
public class TaskController {

	private final TaskService taskService;

	private final UserService userService;

	@GetMapping("/all")
	public List<Task> getAllTasks(@RequestParam(required = false) TaskPriority priority) {
		log.info("getAllTasks() called");
		if (priority != null) {
			return taskService.findByPriority(priority);
		}
		return taskService.getAll();
	}

	@GetMapping("/{taskId}/history")
	public Page<TaskHistory> getHistory(@PathVariable Long taskId, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "5") int size) {
		log.info("getHistory() called");
		return taskService.getHistory(taskId, page, size);
	}

	
	@GetMapping
	public Page<Task> getTasks(TaskFilterRequest filter, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "createdAt,desc") String[] sort) {
		log.info("getTasks() called");
		log.info("Filters: {}", filter.toString());
		log.info("sort: {}", String.join(",", sort));
		log.info("page: {}", page);
		log.info("size: {}", size);
		return taskService.getTasks(filter, page, size, sort);
	}

	@GetMapping("/options/assignee")
	public List<UserResponse> getAssigneeList() {
		log.info("getAssigneeList() called");
		return userService.getAll().stream().map(user -> {
			UserResponse res = new UserResponse();
			res.setFullname(user.getFullname());
			res.setUsername(user.getUsername());
			res.setId(user.getId());
			return res;
		}).toList();
	}

	@GetMapping("/stats")
	public TaskStatisticsResponse getStats() {
		return taskService.getStatistics();
	}

	@PostMapping
	public Task create(@RequestBody Task task) {
		log.info("create() called");
		log.info("Objt to save: {}", task.toString());
		return taskService.create(task);
	}

	@PutMapping("/{id}")
	public Task update(@PathVariable Long id, @RequestBody Task task) {
		log.info("update() called");
		return taskService.update(id, task);
	}

	@DeleteMapping("/{id}")
	public void delete(@PathVariable Long id) {
		log.info("delete() called id=", id);
		taskService.delete(id);
	}

	@GetMapping("/{id}")
	public Task getTask(@PathVariable Long id) {
		log.info("getTask() called id=", id);
		return taskService.getTask(id);
	}

	@GetMapping("/tags")
	public List<String> getAllTags() {
		return taskService.getAllTags();
	}

	@GetMapping("/tags/top")
	public List<TagCount> topTags(@RequestParam(defaultValue = "20") int limit) {
		return taskService.getTopTags().stream().limit(limit).toList();
	}
}
