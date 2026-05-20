package com.leaveflow.leave;

import com.leaveflow.auth.AppUser;
import com.leaveflow.auth.UserRole;
import com.leaveflow.common.ApiException;
import com.leaveflow.common.DeleteResponse;
import com.leaveflow.leave.LeaveDtos.LeaveRequestResponse;
import com.leaveflow.leave.LeaveDtos.LeaveTypeResponse;
import com.leaveflow.leave.LeaveDtos.ReviewLeaveRequest;
import com.leaveflow.storage.FileUploadResult;
import com.leaveflow.storage.S3StorageService;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class LeaveService {
  private final LeaveRequestRepository leaveRequestRepository;
  private final LeaveTypeRepository leaveTypeRepository;
  private final LeaveMapper leaveMapper;
  private final S3StorageService storageService;

  public LeaveService(
      LeaveRequestRepository leaveRequestRepository,
      LeaveTypeRepository leaveTypeRepository,
      LeaveMapper leaveMapper,
      S3StorageService storageService
  ) {
    this.leaveRequestRepository = leaveRequestRepository;
    this.leaveTypeRepository = leaveTypeRepository;
    this.leaveMapper = leaveMapper;
    this.storageService = storageService;
  }

  public List<LeaveTypeResponse> findLeaveTypes() {
    return leaveTypeRepository.findAllByOrderByNameAsc()
        .stream()
        .map(leaveMapper::toLeaveTypeResponse)
        .toList();
  }

  public LeaveRequestResponse createLeaveRequest(
      AppUser employee,
      String leaveTypeId,
      LocalDate startDate,
      LocalDate endDate,
      String reason,
      MultipartFile document
  ) {
    if (employee.getRole() != UserRole.EMPLOYEE) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Only employees can create leave requests");
    }

    if (endDate.isBefore(startDate)) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "End date must be after start date");
    }

    LeaveType leaveType = leaveTypeRepository.findById(leaveTypeId)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Leave type not found"));

    FileUploadResult upload = storageService.uploadSupportingDocument(document, employee.getId());

    LeaveRequest request = LeaveRequest.builder()
        .employee(employee)
        .leaveType(leaveType)
        .startDate(startDate)
        .endDate(endDate)
        .daysCount(countBusinessDays(startDate, endDate))
        .reason(reason)
        .status(LeaveStatus.PENDING)
        .documentUrl(upload == null ? null : upload.url())
        .documentName(upload == null ? null : upload.fileName())
        .documentContentType(upload == null ? null : upload.contentType())
        .documentSizeBytes(upload == null ? null : upload.sizeBytes())
        .build();

    return leaveMapper.toLeaveRequestResponse(leaveRequestRepository.save(request));
  }

  public List<LeaveRequestResponse> myLeaveRequests(AppUser employee) {
    return leaveRequestRepository.findByEmployeeIdOrderByCreatedAtDesc(employee.getId())
        .stream()
        .map(leaveMapper::toLeaveRequestResponse)
        .toList();
  }

  public List<LeaveRequestResponse> allLeaveRequests() {
    return leaveRequestRepository.findAllByOrderByCreatedAtDesc()
        .stream()
        .map(leaveMapper::toLeaveRequestResponse)
        .toList();
  }

  public LeaveRequestResponse reviewLeaveRequest(String id, AppUser reviewer, ReviewLeaveRequest request) {
    if (reviewer.getRole() != UserRole.ADMIN) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Only admins can review leave requests");
    }

    LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Leave request not found"));

    if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
      throw new ApiException(HttpStatus.CONFLICT, "Only pending requests can be reviewed");
    }

    leaveRequest.setStatus(request.status());
    leaveRequest.setReviewer(reviewer);
    leaveRequest.setReviewComment(request.reviewComment());

    return leaveMapper.toLeaveRequestResponse(leaveRequestRepository.save(leaveRequest));
  }

  public DeleteResponse cancelPendingRequest(String id, AppUser employee) {
    LeaveRequest request = leaveRequestRepository.findById(id)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Leave request not found"));

    if (!request.getEmployee().getId().equals(employee.getId())) {
      throw new ApiException(HttpStatus.FORBIDDEN, "You can only cancel your own leave requests");
    }

    if (request.getStatus() != LeaveStatus.PENDING) {
      throw new ApiException(HttpStatus.CONFLICT, "Only pending leave requests can be cancelled");
    }

    leaveRequestRepository.delete(request);
    return new DeleteResponse("Leave request cancelled successfully");
  }

  public DashboardResponse dashboard(AppUser user) {
    List<LeaveRequest> requests = user.getRole() == UserRole.ADMIN
        ? leaveRequestRepository.findAllByOrderByCreatedAtDesc()
        : leaveRequestRepository.findByEmployeeIdOrderByCreatedAtDesc(user.getId());

    return new DashboardResponse(
        requests.size(),
        requests.stream().filter(r -> r.getStatus() == LeaveStatus.PENDING).count(),
        requests.stream().filter(r -> r.getStatus() == LeaveStatus.APPROVED).count(),
        requests.stream().filter(r -> r.getStatus() == LeaveStatus.REJECTED).count(),
        requests.stream().limit(5).map(leaveMapper::toLeaveRequestResponse).toList()
    );
  }

  private int countBusinessDays(LocalDate start, LocalDate end) {
    int days = 0;
    LocalDate current = start;

    while (!current.isAfter(end)) {
      if (current.getDayOfWeek() != DayOfWeek.SATURDAY && current.getDayOfWeek() != DayOfWeek.SUNDAY) {
        days++;
      }
      current = current.plusDays(1);
    }

    return days;
  }

  public record DashboardResponse(
      long total,
      long pending,
      long approved,
      long rejected,
      List<LeaveRequestResponse> recentRequests
  ) {}
}
