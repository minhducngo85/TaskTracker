package com.minhduc.tasktracker.kafka.agent;

import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.common.TopicPartition;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

@Configuration
public class KafkaConfig {

    /**
     * 
     * @return task_created topic
     */
    @Bean
    NewTopic taskCreatedTopic() {
	return TopicBuilder.name(KafkaConstants.TOPIC_TASK_CREATED).partitions(3).replicas(1).build();
    }

    /**
     * 
     * @return task_updated topic
     */
    @Bean
    NewTopic taskUpdatedTopic() {
	return TopicBuilder.name(KafkaConstants.TOPIC_TASK_UPDATED).partitions(3).replicas(1).build();
    }

    /**
     * 
     * @return task_comment_added topic
     */
    @Bean
    NewTopic taskCommentAddedTopic() {
	return TopicBuilder.name(KafkaConstants.TOPIC_TASK_COMMENT_ADDED).partitions(3).replicas(1).build();
    }
    
    /** 
     * Dead_Letter_Topic
     * */
    @Bean
     NewTopic taskCreatedDltTopic() {
        return TopicBuilder
                .name(KafkaConstants.TOPIC_TASK_CREATED_DLT)
                .partitions(1)
                .replicas(1)
                .build();
    }

    /**
     * retries config for Kafka
     * 
     * @return
     */
    @Bean
    DefaultErrorHandler errorHandler(KafkaTemplate<Object, Object> kafkaTemplate) {
	
	   DeadLetterPublishingRecoverer recoverer =
	                new DeadLetterPublishingRecoverer(
	                        kafkaTemplate,
	                        (record, ex) ->
	                                new TopicPartition(
	                                        KafkaConstants.TOPIC_TASK_CREATED_DLT,
	                                        0));

	   
	FixedBackOff backOff = new FixedBackOff(2000L, // 2s
		3 // retry 3 lần
	);
	return new DefaultErrorHandler(recoverer, backOff);
    }
}
