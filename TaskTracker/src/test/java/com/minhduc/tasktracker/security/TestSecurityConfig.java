package com.minhduc.tasktracker.security;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security config for testing
 * 
 * @author Minh Duc Ngo - 2026
 */
@TestConfiguration
public class TestSecurityConfig {
	@Bean
	SecurityFilterChain testSecurityFilterChain(HttpSecurity http) throws Exception {
		return http.csrf(AbstractHttpConfigurer::disable).authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
				.build();
	}
}
