package com.minhduc.tasktracker.controller;

import java.security.Principal;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.minhduc.tasktracker.dto.TaskCommentDto;
import com.minhduc.tasktracker.service.TaskCommentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/tasks/{taskId}/comments")
@RequiredArgsConstructor
public class TaskCommentController {
	private final TaskCommentService service;

	@GetMapping
	public Page<TaskCommentDto> getComments(@PathVariable Long taskId, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "5") int size) {
		log.info("getComments called! page={}, size={}", page, size);
		return service.getComments(taskId, page, size);
	}

	@PostMapping
	public TaskCommentDto addComment(@PathVariable Long taskId, @RequestBody Map<String, String> body,
			Principal principal) {
		log.info("addComment called!");
		return service.addComment(taskId, body.get("content"), principal.getName());
	}
}
