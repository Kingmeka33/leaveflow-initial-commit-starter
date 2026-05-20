package com.leaveflow.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class AuthDtos {
  public record RegisterRequest(
      @NotBlank String fullName,
      @Email @NotBlank String email,
      @NotBlank String password,
      @NotNull UserRole role,
      String department
  ) {}

  public record LoginRequest(
      @Email @NotBlank String email,
      @NotBlank String password
  ) {}

  public record UserResponse(
      String id,
      String full_name,
      String email,
      String role,
      String department,
      LocalDateTime created_at,
      LocalDateTime updated_at,
      long total,
      long pending,
      long approved
  ) {}

  public record AuthResponse(String accessToken, UserResponse user) {}
}
