package com.leaveflow.leave;

import com.leaveflow.auth.AuthMapper;
import com.leaveflow.leave.LeaveDtos.LeaveRequestResponse;
import com.leaveflow.leave.LeaveDtos.LeaveTypeResponse;
import org.springframework.stereotype.Component;

@Component
public class LeaveMapper {
  private final AuthMapper authMapper;

  public LeaveMapper(AuthMapper authMapper) {
    this.authMapper = authMapper;
  }

  public LeaveTypeResponse toLeaveTypeResponse(LeaveType type) {
    return new LeaveTypeResponse(type.getId(), type.getName(), type.getMaxDaysPerYear(), type.getCreatedAt());
  }

  public LeaveRequestResponse toLeaveRequestResponse(LeaveRequest request) {
    return new LeaveRequestResponse(
        request.getId(),
        request.getEmployee().getId(),
        request.getLeaveType().getId(),
        request.getStartDate(),
        request.getEndDate(),
        request.getDaysCount(),
        request.getReason(),
        request.getStatus().name().toLowerCase(),
        request.getReviewer() == null ? null : request.getReviewer().getId(),
        request.getReviewComment(),
        request.getDocumentUrl(),
        request.getDocumentName(),
        request.getDocumentContentType(),
        request.getDocumentSizeBytes(),
        request.getCreatedAt(),
        request.getUpdatedAt(),
        authMapper.toUserResponse(request.getEmployee()),
        toLeaveTypeResponse(request.getLeaveType()),
        request.getReviewer() == null ? null : authMapper.toUserResponse(request.getReviewer())
    );
  }
}
