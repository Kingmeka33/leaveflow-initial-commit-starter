package com.leaveflow.auth;

import com.leaveflow.auth.AuthDtos.AuthResponse;
import com.leaveflow.auth.AuthDtos.LoginRequest;
import com.leaveflow.auth.AuthDtos.RegisterRequest;
import com.leaveflow.auth.AuthDtos.UserResponse;
import com.leaveflow.common.BaseController;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController extends BaseController {
  private final AuthService authService;
  private final AuthMapper authMapper;

  public AuthController(AuthService authService, AuthMapper authMapper) {
    this.authService = authService;
    this.authMapper = authMapper;
  }

  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
    return created(authService.register(request));
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
    return ok(authService.login(request));
  }

  @GetMapping("/me")
  public ResponseEntity<UserResponse> me(Authentication authentication) {
    return ok(authMapper.toUserResponse((AppUser) authentication.getPrincipal()));
  }
}
