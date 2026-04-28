package com.minhduc.tasktracker.logging;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import com.minhduc.tasktracker.security.SecurityUtils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

/**
 * @author Minh Duc Ngo
 */
@Slf4j
@Component
public class RequestResponseLoggingFilter extends OncePerRequestFilter {

    private static final int MAX_PAYLOAD_LENGTH = 1000;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
	    throws ServletException, IOException {
	long start = System.currentTimeMillis();

	// Skip logging for static resources && login password
	String uri = request.getRequestURI();
	if (uri.startsWith("/actuator") || uri.startsWith("/swagger") || uri.contains("favicon")
		|| uri.contains("/api/auth/login")) {
	    filterChain.doFilter(request, response);
	    return;
	}

	ContentCachingRequestWrapper requestWrapper = new ContentCachingRequestWrapper(request);
	ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(response);

	try {
	    filterChain.doFilter(requestWrapper, responseWrapper);
	} finally {
	    long duration = System.currentTimeMillis() - start;

	    logRequest(requestWrapper);
	    logResponse(responseWrapper, duration);

	    responseWrapper.copyBodyToResponse();
	}

    }

    private void logRequest(ContentCachingRequestWrapper request) {
	String body = getPayload(request.getContentAsByteArray());

	log.info("REQUEST method={} uri={} user={} correlationId={} body={}", request.getMethod(),
		request.getRequestURI(), SecurityUtils.getCurrentUser(), MDC.get("correlationId"), body);
    }

    private void logResponse(ContentCachingResponseWrapper response, long duration) {
	String body = getPayload(response.getContentAsByteArray());

	log.info("RESPONSE status={} time={}ms user={} correlationId={}  body={}", response.getStatus(), duration,
		SecurityUtils.getCurrentUser(), MDC.get("correlationId"), body);
    }

    private String getPayload(byte[] buf) {
	if (buf == null || buf.length == 0)
	    return "";
	String payload = new String(buf, StandardCharsets.UTF_8);
	if (payload.length() > MAX_PAYLOAD_LENGTH) {
	    return payload.substring(0, MAX_PAYLOAD_LENGTH) + "...";
	}
	return payload;
    }

}
