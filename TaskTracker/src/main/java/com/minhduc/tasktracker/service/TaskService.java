package com.minhduc.tasktracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.minhduc.tasktracker.controller.exceptionhandling.ResourceNotFoundException;
import com.minhduc.tasktracker.entity.Task;
import com.minhduc.tasktracker.entity.TaskPriority;
import com.minhduc.tasktracker.entity.TaskStatus;
import com.minhduc.tasktracker.repository.TaskRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskService {
	private final TaskRepository taskRepository;

	/**
	 * @return all task form db
	 */
	public List<Task> getAll() {
		return taskRepository.findAll();
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
	public Task update(Long id, Task updated) {
		log.info("Updated Obj={}", updated.toString());
		Task task = taskRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
		task.setTitle(updated.getTitle());
		task.setAssignedTo(updated.getAssignedTo());
		task.setDescription(updated.getDescription());
		task.setStatus(updated.getStatus());
		task.setPriority(updated.getPriority());

		return taskRepository.save(task);
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
}
