package com.minhduc.tasktracker.controller.exceptionhandling;

public class ResourceNotFoundException extends RuntimeException {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1519156499480021450L;

	public ResourceNotFoundException(String message) {
        super(message);
    }
}
