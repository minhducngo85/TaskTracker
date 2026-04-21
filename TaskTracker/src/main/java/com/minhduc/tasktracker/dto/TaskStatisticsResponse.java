package com.minhduc.tasktracker.dto;

import lombok.Data;

@Data
public class TaskStatisticsResponse {
	private long total;

	private long todo;
	private long inProgress;
	private long done;

	private long critical;
	private long high;
	private long medium;
	private long low;
}
