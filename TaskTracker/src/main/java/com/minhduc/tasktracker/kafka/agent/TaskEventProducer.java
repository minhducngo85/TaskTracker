package com.minhduc.tasktracker.kafka.agent;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.minhduc.tasktracker.kafka.TaskCommentAddedEvent;
import com.minhduc.tasktracker.kafka.TaskCreatedEvent;
import com.minhduc.tasktracker.kafka.TaskUpdateEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskEventProducer {
    private final KafkaTemplate<String, Object> kafkaTemplate;

    /**
     * task-created topic
     * 
     * @param event
     */
    public void sendTaskCreatedEvent(TaskCreatedEvent event) {
	log.info("Publishing event: {}", event);
	kafkaTemplate.send(KafkaConstants.TOPIC_TASK_CREATED,event.getTaskId().toString(), event).whenComplete((result, ex) -> {
	    if (ex != null) {
		log.error("SEND FAILED", ex);
	    } else {
		log.info("SENT topic={} partition={} offset={}", result.getRecordMetadata().topic(),
			result.getRecordMetadata().partition(), result.getRecordMetadata().offset());
	    }
	});
    }

    /**
     * task-updated topic
     * 
     * @param event
     */
    public void sendTaskUpdateEvent(TaskUpdateEvent event) {
	log.info("Publishing event: {}", event);
	kafkaTemplate.send(KafkaConstants.TOPIC_TASK_UPDATED,event.getTaskId().toString(), event);
    }

    /**
     * task-comment event
     * @param event
     */
    public void sendTaskCommentAddedEvent(TaskCommentAddedEvent event) {
	log.info("Publishing event: {}", event);
	kafkaTemplate.send(KafkaConstants.TOPIC_TASK_COMMENT_ADDED, event);
    }
}
