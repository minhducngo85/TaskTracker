package com.minhduc.tasktracker.kafka;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskUpdateEvent {
    private Long taskId;
    private String field;
    private String oldValue;
    private String newValue;
    private String username;
}
