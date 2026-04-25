package com.minhduc.tasktracker.dto;

import lombok.Data;

@Data
public class MyWorkDto {
	private int overdue;
	private int today;
	private int thisWeek;

	public MyWorkDto(int overdue, int today, int thisWeek) {
		super();
		this.overdue = overdue;
		this.today = today;
		this.thisWeek = thisWeek;
	}

}
