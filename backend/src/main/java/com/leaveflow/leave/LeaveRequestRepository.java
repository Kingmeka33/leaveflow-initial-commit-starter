package com.leaveflow.leave;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, String> {
  List<LeaveRequest> findByEmployeeIdOrderByCreatedAtDesc(String employeeId);
  List<LeaveRequest> findAllByOrderByCreatedAtDesc();
  long countByEmployeeId(String employeeId);
  long countByEmployeeIdAndStatus(String employeeId, LeaveStatus status);
}
