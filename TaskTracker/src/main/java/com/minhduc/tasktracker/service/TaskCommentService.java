package com.minhduc.tasktracker.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.minhduc.tasktracker.controller.exceptionhandling.ResourceNotFoundException;
import com.minhduc.tasktracker.dto.TaskCommentDTO;
import com.minhduc.tasktracker.entity.Task;
import com.minhduc.tasktracker.entity.TaskComment;
import com.minhduc.tasktracker.entity.User;
import com.minhduc.tasktracker.repository.TaskCommentRepository;
import com.minhduc.tasktracker.repository.TaskRepository;
import com.minhduc.tasktracker.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * @author Minh Duc Ngo
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TaskCommentService {
	private final TaskRepository taskRepo;
	private final UserRepository userRepo;
	private final TaskCommentRepository commentRepo;

	/**
	 * to get list of comments by task id
	 * 
	 * @param taskId
	 * @return
	 */
	public Page<TaskCommentDTO> getComments(long taskId, int page, int size) {
		if (page < 0) page = 0;
	    if (size <= 0 || size > 50) size = 10; // tránh query quá lớn
	    
		Page<TaskComment> comments = commentRepo.findByTaskIdOrderByCreatedAtDesc(taskId, PageRequest.of(page, size));
		return comments.map(this::mapToDTO);
	}

	public TaskCommentDTO addComment(Long taskId, String content, String username) {
		Task task = taskRepo.findById(taskId)
				.orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
		String fullName = userRepo.findByUsername(username).map(User::getFullname).orElse(username);
		TaskComment comment = new TaskComment();
		comment.setContent(content);
		comment.setCreatedBy(username);
		comment.setTask(task);
		comment.setCreatedByFullName(fullName);
		TaskComment saved = commentRepo.save(comment);
		return mapToDTO(saved);
	}

	/**
	 * map entity to dto
	 * 
	 * @param c
	 * @return
	 */
	private TaskCommentDTO mapToDTO(TaskComment c) {
		TaskCommentDTO dto = new TaskCommentDTO();
		dto.setId(c.getId());
		dto.setContent(c.getContent());
		dto.setCreatedBy(c.getCreatedBy());
		dto.setCreatedByFullName(c.getCreatedByFullName());
		dto.setCreatedAt(c.getCreatedAt());
		dto.setUpdatedAt(c.getUpdatedAt());
		return dto;
	}
}
