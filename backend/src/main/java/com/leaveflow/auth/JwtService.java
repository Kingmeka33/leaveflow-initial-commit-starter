package com.leaveflow.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
  @Value("${jwt.secret}")
  private String jwtSecret;

  @Value("${jwt.expiration-ms}")
  private long expirationMs;

  private SecretKey key() {
    return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
  }

  public String generateToken(AppUser user) {
    return Jwts.builder()
        .subject(user.getId())
        .claim("email", user.getEmail())
        .claim("role", user.getRole().name())
        .issuedAt(new Date())
        .expiration(new Date(System.currentTimeMillis() + expirationMs))
        .signWith(key())
        .compact();
  }

  public Claims validateToken(String token) {
    return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload();
  }
}
