import type { ReactNode } from 'react';
import type { LeaveStatus } from '../lib/database.types';

interface BadgeProps {
  status: LeaveStatus;
  children?: ReactNode;
}

const statusConfig: Record<LeaveStatus, { bg: string; color: string; label: string }> = {
  pending: { bg: 'var(--warning-100)', color: 'var(--warning-700)', label: 'Pending' },
  approved: { bg: 'var(--success-100)', color: 'var(--success-700)', label: 'Approved' },
  rejected: { bg: 'var(--error-100)', color: 'var(--error-700)', label: 'Rejected' },
};

export function Badge({ status, children }: BadgeProps) {
  const config = statusConfig[status];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '3px 10px',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.75rem',
      fontWeight: 600,
      background: config.bg,
      color: config.color,
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: config.color, display: 'inline-block' }} />
      {children ?? config.label}
    </span>
  );
}
