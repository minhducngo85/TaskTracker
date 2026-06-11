package com.minhduc.tasktracker.kafka.agent;

import java.time.LocalDateTime;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.minhduc.tasktracker.entity.Notification;
import com.minhduc.tasktracker.kafka.TaskCreatedEvent;
import com.minhduc.tasktracker.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class NotificationConsumer {
    private final NotificationRepository notificationRepo;

    @KafkaListener(topics = "task-created", groupId = "notification-group")
    public void consume(TaskCreatedEvent event) {
	log.info("Received event[notification-group]: {}", event);
	Notification notification = new Notification();

	notification.setUsername(event.getUsername());

	notification.setMessage("Task '" + event.getTitle() + "' created successfully");

	notification.setCreatedAt(LocalDateTime.now());

	notification.setRead(false);

	notificationRepo.save(notification);
    }
}
