package com.minhduc.tasktracker.dto;

import com.minhduc.tasktracker.entity.Task;
import com.minhduc.tasktracker.entity.TaskComment;
import com.minhduc.tasktracker.entity.TaskHistory;

public class DtoMapper {
	public static TaskDto mapTaskToDto(Task aTask) {
		if (aTask == null) {
			return null;
		}
		TaskDto dto = new TaskDto();
		dto.setId(aTask.getId());
		dto.setTitle(aTask.getTitle());
		dto.setAssignedTo(aTask.getAssignedTo());
		dto.setCreatedAt(aTask.getCreatedAt());
		dto.setUpdatedAt(aTask.getUpdatedAt());
		dto.setDescription(aTask.getDescription());
		dto.setDueDate(aTask.getDueDate());
		dto.setPriority(aTask.getPriority());
		dto.setStatus(aTask.getStatus());
		dto.setTags(aTask.getTags());
		return dto;
	}

	/**
	 * map entity to dto
	 * 
	 * @param c
	 * @return
	 */
	public static TaskCommentDto mapToCommentDto(TaskComment c) {
		TaskCommentDto dto = new TaskCommentDto();
		dto.setId(c.getId());
		dto.setContent(c.getContent());
		dto.setCreatedBy(c.getCreatedBy());
		dto.setCreatedByFullName(c.getCreatedByFullName());
		dto.setCreatedAt(c.getCreatedAt());
		dto.setUpdatedAt(c.getUpdatedAt());
		return dto;
	}

	/**
	 * convert history to activity dto object
	 * @param h
	 * @return
	 */
	public static ActivityDto mapToActivityDto(ActivityProjection h) {
		String action;
		String message;
		switch (h.getField().toLowerCase()) {
		case "status" -> {
			action = "STATUS_CHANGED";
			message = String.format("%s changed status from %s → %s", h.getChangedByFullName(), h.getOldValue(),
					h.getNewValue());
		}
		case "priority" -> {
			action = "PRIORITY_CHANGED";
			message = String.format("%s changed priority from %s → %s", h.getChangedByFullName(), h.getOldValue(),
					h.getNewValue());
		}
		case "assignedto" -> {
			action = "ASSIGNED";
			message = String.format("%s assigned task to %s", h.getChangedByFullName(), h.getNewValue());
		}
		case "duedate" -> {
			action = "DUE_DATE_CHANGED";
			message = String.format("%s changed due date to %s", h.getChangedByFullName(), h.getNewValue());
		}
		case "task" -> {
			action = "CREATED";
			message = String.format("%s created new task", h.getChangedByFullName());
		}
		default -> {
			action = "UPDATED";
			message = String.format("%s updated task", h.getChangedByFullName());
		}
		}
		return new ActivityDto(h.getTaskId(), h.getTaskTitle(), action, message, h.getUser(), h.getCreatedAt());
	}
}
