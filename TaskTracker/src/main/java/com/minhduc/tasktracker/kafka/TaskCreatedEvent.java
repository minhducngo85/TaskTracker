package com.minhduc.tasktracker.kafka;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskCreatedEvent {
    private Long taskId;
    private String title;
    private String status;
    private String username;
}
