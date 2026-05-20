package com.leaveflow.leave;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveTypeRepository extends JpaRepository<LeaveType, String> {
  List<LeaveType> findAllByOrderByNameAsc();
}
