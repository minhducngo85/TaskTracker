package com.minhduc.tasktracker.service;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import com.minhduc.tasktracker.entity.User;

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

	public String extractRole(String token) {
		return extractAllClaims(token).get("role", String.class);
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

	public String generateToken(User user) {
		return Jwts.builder().setSubject(user.getUsername()).claim("role", user.getRole().name()) // 🔥 thêm role
				.setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1h
				.signWith(getKey()).compact();
	}

	public String generateRefreshToken(User user) {
		return Jwts.builder().setSubject(user.getUsername()).claim("type", "refresh") // 👈 important
				// 1 day
				.setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 1))
				.signWith(getKey()).compact();
	}

	public boolean isRefreshToken(String token) {
		return "refresh".equals(extractAllClaims(token).get("type", String.class));
	}
}
