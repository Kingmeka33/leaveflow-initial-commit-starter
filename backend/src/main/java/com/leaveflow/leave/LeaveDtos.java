package com.leaveflow.leave;

import com.leaveflow.auth.AuthDtos.UserResponse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class LeaveDtos {
  public record LeaveTypeResponse(String id, String name, Integer max_days_per_year, LocalDateTime created_at) {}

  public record LeaveRequestResponse(
      String id,
      String employee_id,
      String leave_type_id,
      LocalDate start_date,
      LocalDate end_date,
      Integer days_count,
      String reason,
      String status,
      String reviewed_by,
      String review_comment,
      String document_url,
      String document_name,
      String document_content_type,
      Long document_size_bytes,
      LocalDateTime created_at,
      LocalDateTime updated_at,
      UserResponse profiles,
      LeaveTypeResponse leave_types,
      UserResponse reviewer
  ) {}

  public record ReviewLeaveRequest(
      @NotNull LeaveStatus status,
      String reviewComment
  ) {}
}
