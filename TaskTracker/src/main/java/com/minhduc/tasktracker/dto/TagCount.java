package com.minhduc.tasktracker.dto;

import lombok.Data;

@Data
public class TagCount {
	public TagCount(String tag, long count) {
		this.tag = tag;
		this.count = count;
	}

	private String tag;
	private long count;
}
