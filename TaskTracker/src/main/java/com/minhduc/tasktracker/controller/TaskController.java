package com.minhduc.tasktracker.controller;

import java.util.List;

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

import com.minhduc.tasktracker.entity.Task;
import com.minhduc.tasktracker.entity.TaskPriority;
import com.minhduc.tasktracker.service.TaskService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
@RestController
@RequestMapping("api/tasks")
@RequiredArgsConstructor
public class TaskController {

	private final TaskService taskService;

	
	@GetMapping
	public List<Task> getTasks(@RequestParam(required = false) TaskPriority priority) {
		log.info("getTask() called");
	    if (priority != null) {
	        return taskService.findByPriority(priority);
	    }
	    return taskService.getAll();
	}
	
	@PostMapping
	public Task create(@RequestBody Task task) {
		log.info("create() called");
		return taskService.create(task);
	}
	
	@PutMapping("/{id}")
	public Task update(@PathVariable Long id, @RequestBody Task task) {
		log.info("update() called");
		return taskService.update(id, task);
	}
	
	@DeleteMapping("/{id}")
	public void delete(@PathVariable Long id) {
		log.info("delete() called");
		 taskService.delete(id);
	}
}
