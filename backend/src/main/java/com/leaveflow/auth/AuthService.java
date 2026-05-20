package com.leaveflow.auth;

import com.leaveflow.auth.AuthDtos.AuthResponse;
import com.leaveflow.auth.AuthDtos.LoginRequest;
import com.leaveflow.auth.AuthDtos.RegisterRequest;
import com.leaveflow.common.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
  private final AppUserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthMapper authMapper;

  public AuthService(AppUserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthMapper authMapper) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.authMapper = authMapper;
  }

  public AuthResponse register(RegisterRequest request) {
    if (userRepository.existsByEmail(request.email())) {
      throw new ApiException(HttpStatus.CONFLICT, "Email is already registered");
    }

    AppUser user = AppUser.builder()
        .fullName(request.fullName())
        .email(request.email())
        .passwordHash(passwordEncoder.encode(request.password()))
        .role(request.role())
        .department(request.department())
        .build();

    AppUser saved = userRepository.save(user);
    return new AuthResponse(jwtService.generateToken(saved), authMapper.toUserResponse(saved));
  }

  public AuthResponse login(LoginRequest request) {
    AppUser user = userRepository.findByEmail(request.email())
        .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

    if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    return new AuthResponse(jwtService.generateToken(user), authMapper.toUserResponse(user));
  }

  public AppUser findById(String id) {
    return userRepository.findById(id)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
  }
}
