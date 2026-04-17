package com.minhduc.tasktracker.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtFilter jwtFilter;
	private final JwtAuthEntryPoint authEntryPoint;
	private final JwtAccessDeniedHandler accessDeniedHandler;

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http.cors(cors -> {
		}) // Có enabled
				.csrf(csrf -> csrf.disable())
				// stateless for JWT
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

				// Exception handling
				.exceptionHandling(ex -> ex.authenticationEntryPoint(authEntryPoint) // 🔥 401
						.accessDeniedHandler(accessDeniedHandler) // 🔥 403
				)

				// allow iframe (H2 console)
				.headers(headers -> headers.frameOptions(frame -> frame.disable()))

				// Authentication
				.authorizeHttpRequests(auth -> auth
						// Allow angular request. Angualuar always send OPTIONS /api/tasks
						.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
						// allow H2 console
						.requestMatchers("/h2-console/**").permitAll()
						// allow authentication path
						.requestMatchers("/api/auth/**").permitAll()
						// allow test path
						.requestMatchers("/api/test/**").permitAll()
						// other request
						.anyRequest().authenticated())
				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class).build();
	}

	// 🔥 CORS config chính nằm ở đây
	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();

		config.setAllowedOrigins(List.of("http://localhost:4200"));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("*"));
		config.setAllowCredentials(true);
		config.setExposedHeaders(List.of("Authorization"));

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);

		return source;
	}
}
