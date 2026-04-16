package com.minhduc.tasktracker.service;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
	private final String SECRET = "my-secret-key-my-secret-key-my-secret-key"; // >= 32 chars

	private SecretKey getKey() {
		return Keys.hmacShaKeyFor(SECRET.getBytes());
	}

	public String extractUsername(String token) {
		return extractAllClaims(token).getSubject();
	}

	private Claims extractAllClaims(String token) {
		return Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token).getBody();
	}

	private boolean isTokenExpired(String token) {
		return extractAllClaims(token).getExpiration().before(new Date());
	}

	public boolean isTokenValid(String token) {
		try {
			return !isTokenExpired(token);
		} catch (Exception e) {
			return false;
		}
	}
	
	
	public String generateToken(String username) {
	    return Jwts.builder()
	            .setSubject(username)
	            .setIssuedAt(new Date())
	            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1h
	            .signWith(getKey())
	            .compact();
	}
}
