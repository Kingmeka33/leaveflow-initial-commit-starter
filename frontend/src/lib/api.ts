import type { LeaveRequest, LeaveStatus, LeaveType, Profile } from './database.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  user: Profile & { email: string };
}

function getToken() {
  return localStorage.getItem('accessToken');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getToken();

  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'object' && payload?.message ? payload.message : 'Request failed';
    throw new Error(message);
  }

  return payload as T;
}

export const api = {
  login(email: string, password: string) {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register(email: string, password: string, fullName: string, role: 'admin' | 'employee', department: string) {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        fullName,
        role: role.toUpperCase(),
        department,
      }),
    });
  },

  me() {
    return request<Profile & { email: string }>('/auth/me');
  },

  dashboard() {
    return request<{ total: number; pending: number; approved: number; rejected: number; recentRequests: LeaveRequest[] }>('/leave-requests/dashboard');
  },

  leaveTypes() {
    return request<LeaveType[]>('/leave-types');
  },

  myLeaves() {
    return request<LeaveRequest[]>('/leave-requests/my');
  },

  allLeaves() {
    return request<LeaveRequest[]>('/leave-requests');
  },

  createLeave(formData: FormData) {
    return request<LeaveRequest>('/leave-requests', {
      method: 'POST',
      body: formData,
    });
  },

  cancelLeave(id: string) {
    return request<{ message: string }>(`/leave-requests/${id}`, {
      method: 'DELETE',
    });
  },

  reviewLeave(id: string, status: LeaveStatus, reviewComment: string) {
    return request<LeaveRequest>(`/leave-requests/${id}/review`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: status.toUpperCase(),
        reviewComment,
      }),
    });
  },

  employees() {
    return request<Profile[]>('/users/employees');
  },
};

export { API_BASE_URL };
