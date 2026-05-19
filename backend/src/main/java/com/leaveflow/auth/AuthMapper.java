package com.leaveflow.auth;

import com.leaveflow.auth.AuthDtos.UserResponse;
import com.leaveflow.leave.LeaveRequestRepository;
import com.leaveflow.leave.LeaveStatus;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {
  private final LeaveRequestRepository leaveRequestRepository;

  public AuthMapper(LeaveRequestRepository leaveRequestRepository) {
    this.leaveRequestRepository = leaveRequestRepository;
  }

  public UserResponse toUserResponse(AppUser user) {
    long total = user.getRole() == UserRole.EMPLOYEE ? leaveRequestRepository.countByEmployeeId(user.getId()) : 0;
    long pending = user.getRole() == UserRole.EMPLOYEE ? leaveRequestRepository.countByEmployeeIdAndStatus(user.getId(), LeaveStatus.PENDING) : 0;
    long approved = user.getRole() == UserRole.EMPLOYEE ? leaveRequestRepository.countByEmployeeIdAndStatus(user.getId(), LeaveStatus.APPROVED) : 0;

    return new UserResponse(
        user.getId(),
        user.getFullName(),
        user.getEmail(),
        user.getRole().name().toLowerCase(),
        user.getDepartment(),
        user.getCreatedAt(),
        user.getUpdatedAt(),
        total,
        pending,
        approved
    );
  }
}
