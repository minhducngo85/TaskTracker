package com.minhduc.tasktracker.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {
    public static String getCurrentUser() {
	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

	if (authentication == null || !authentication.isAuthenticated()) {
	    return "anonymous";
	}

	return authentication.getName(); // username
    }
}
