export type Role = 'admin' | 'employee';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  full_name: string;
  email?: string;
  role: Role;
  department: string;
  created_at: string;
  updated_at: string;
}

export interface LeaveType {
  id: string;
  name: string;
  max_days_per_year: number;
  created_at: string;
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  leave_type_id: string;
  start_date: string;
  end_date: string;
  days_count: number;
  reason: string;
  status: LeaveStatus;
  reviewed_by: string | null;
  review_comment: string;
  document_url?: string | null;
  document_name?: string | null;
  document_content_type?: string | null;
  document_size_bytes?: number | null;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  leave_types?: LeaveType;
  reviewer?: Profile;
}
