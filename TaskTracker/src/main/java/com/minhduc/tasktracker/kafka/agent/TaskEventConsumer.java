package com.minhduc.tasktracker.kafka.agent;

import java.time.LocalDateTime;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import com.minhduc.tasktracker.entity.Activity;
import com.minhduc.tasktracker.kafka.TaskCommentAddedEvent;
import com.minhduc.tasktracker.kafka.TaskCreatedEvent;
import com.minhduc.tasktracker.kafka.TaskUpdateEvent;
import com.minhduc.tasktracker.repository.ActivityRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class TaskEventConsumer {

    private final ActivityRepository activityRepository;

    @KafkaListener(topics = KafkaConstants.TOPIC_TASK_CREATED, groupId = "activity-group")
    public void consume(TaskCreatedEvent event, @Header(KafkaHeaders.RECEIVED_KEY) String key,
	    @Header(KafkaHeaders.RECEIVED_PARTITION) int partition, @Header(KafkaHeaders.OFFSET) long offset) {
	log.info("Received key={} Parition={} Offset={} event={}", key, partition, offset, event);

	// to test retries & DLT in Kafka
	if (event.getTitle().contains("FAIL")) {
	    throw new RuntimeException("Demo Retry");
	}

	Activity anActivity = new Activity();
	anActivity.setUsername(event.getUsername());
	anActivity.setAction("TASK_CREATE");
	anActivity.setDescription("Task '" + event.getTitle() + "' was created.");
	anActivity.setCreatedAt(LocalDateTime.now());
	activityRepository.save(anActivity);
    }

    @KafkaListener(topics = KafkaConstants.TOPIC_TASK_UPDATED, groupId = "activity-group")
    public void consume(TaskUpdateEvent event) {
	log.info("Received event: {}", event);
	Activity anActivity = new Activity();
	anActivity.setUsername(event.getUsername());
	anActivity.setAction("TASK_UPDATED");
	anActivity.setDescription(String.format("%s was changed from %s to %s", event.getField(),
		event.getOldValue() == null ? "NULL" : event.getOldValue(),
		event.getNewValue() == null ? "NULL" : event.getNewValue()));
	anActivity.setCreatedAt(LocalDateTime.now());
	activityRepository.save(anActivity);
    }

    @KafkaListener(topics = KafkaConstants.TOPIC_TASK_COMMENT_ADDED, groupId = "activity-group")
    public void consume(TaskCommentAddedEvent event) {
	log.info("Received event: {}", event);
	Activity anActivity = new Activity();
	anActivity.setUsername(event.getUsername());
	anActivity.setAction("TASK_COMMENT");
	anActivity.setDescription(String.format("%s commented on Task #%d", event.getUsername(), event.getTaskId()));
	anActivity.setCreatedAt(LocalDateTime.now());
	activityRepository.save(anActivity);
    }

    @KafkaListener(topics = KafkaConstants.TOPIC_TASK_CREATED_DLT, groupId = "dlq-group")
    public void consume(TaskCreatedEvent event) {
	log.error("DLQ MESSAGE RECEIVED: {}", event);
    }
}
