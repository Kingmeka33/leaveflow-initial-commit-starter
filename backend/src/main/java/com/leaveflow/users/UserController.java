package com.leaveflow.users;

import com.leaveflow.auth.AppUserRepository;
import com.leaveflow.auth.AuthMapper;
import com.leaveflow.auth.AuthDtos.UserResponse;
import com.leaveflow.auth.UserRole;
import com.leaveflow.common.BaseController;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController extends BaseController {
  private final AppUserRepository userRepository;
  private final AuthMapper authMapper;

  public UserController(AppUserRepository userRepository, AuthMapper authMapper) {
    this.userRepository = userRepository;
    this.authMapper = authMapper;
  }

  @GetMapping("/employees")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<UserResponse>> employees() {
    return ok(userRepository.findByRoleOrderByFullNameAsc(UserRole.EMPLOYEE)
        .stream()
        .map(authMapper::toUserResponse)
        .toList());
  }
}
