package com.leaveflow.leave;

import com.leaveflow.auth.AppUser;
import com.leaveflow.common.BaseController;
import com.leaveflow.common.DeleteResponse;
import com.leaveflow.leave.LeaveDtos.LeaveRequestResponse;
import com.leaveflow.leave.LeaveDtos.LeaveTypeResponse;
import com.leaveflow.leave.LeaveDtos.ReviewLeaveRequest;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class LeaveController extends BaseController {
  private final LeaveService leaveService;

  public LeaveController(LeaveService leaveService) {
    this.leaveService = leaveService;
  }

  @GetMapping("/leave-types")
  public ResponseEntity<List<LeaveTypeResponse>> leaveTypes() {
    return ok(leaveService.findLeaveTypes());
  }

  @GetMapping("/leave-requests/dashboard")
  public ResponseEntity<LeaveService.DashboardResponse> dashboard(Authentication authentication) {
    return ok(leaveService.dashboard((AppUser) authentication.getPrincipal()));
  }

  @GetMapping("/leave-requests/my")
  @PreAuthorize("hasRole('EMPLOYEE')")
  public ResponseEntity<List<LeaveRequestResponse>> myLeaveRequests(Authentication authentication) {
    return ok(leaveService.myLeaveRequests((AppUser) authentication.getPrincipal()));
  }

  @GetMapping("/leave-requests")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<LeaveRequestResponse>> allLeaveRequests() {
    return ok(leaveService.allLeaveRequests());
  }

  @PostMapping(value = "/leave-requests", consumes = "multipart/form-data")
  @PreAuthorize("hasRole('EMPLOYEE')")
  public ResponseEntity<LeaveRequestResponse> createLeaveRequest(
      Authentication authentication,
      @RequestParam String leaveTypeId,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
      @RequestParam(required = false) String reason,
      @RequestPart(required = false) MultipartFile document
  ) {
    return created(leaveService.createLeaveRequest(
        (AppUser) authentication.getPrincipal(),
        leaveTypeId,
        startDate,
        endDate,
        reason,
        document
    ));
  }

  @PatchMapping("/leave-requests/{id}/review")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<LeaveRequestResponse> review(
      @PathVariable String id,
      Authentication authentication,
      @Valid @RequestBody ReviewLeaveRequest request
  ) {
    return ok(leaveService.reviewLeaveRequest(id, (AppUser) authentication.getPrincipal(), request));
  }

  @DeleteMapping("/leave-requests/{id}")
  @PreAuthorize("hasRole('EMPLOYEE')")
  public ResponseEntity<DeleteResponse> cancel(@PathVariable String id, Authentication authentication) {
    return ok(leaveService.cancelPendingRequest(id, (AppUser) authentication.getPrincipal()));
  }
}
