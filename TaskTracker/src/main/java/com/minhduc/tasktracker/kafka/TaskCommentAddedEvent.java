package com.minhduc.tasktracker.kafka;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskCommentAddedEvent {
    private Long taskId;
    private String username;
}
