package com.minhduc.tasktracker.logging;

import java.io.IOException;
import java.util.UUID;

import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * @author Minh Duc Ngo - 2026
 */
@Component
public class CorrelationIdFilter extends OncePerRequestFilter {

    private static final String HEADER_NAME = "X-Correlation-Id";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
	    throws ServletException, IOException {

	String correlationId = request.getHeader(HEADER_NAME);

	if (correlationId == null) {
	    correlationId = UUID.randomUUID().toString();
	}

	MDC.put("correlationId", correlationId);
	response.setHeader(HEADER_NAME, correlationId);

	try {
	    filterChain.doFilter(request, response);
	} finally {
	    MDC.clear();
	}
    }
}