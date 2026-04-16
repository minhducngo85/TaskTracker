package com.minhduc.tasktracker.controller.exceptionhandling;

public class InvalidCredentialsException extends RuntimeException {
	  public InvalidCredentialsException(String message) {
	        super(message);
	    }
}
