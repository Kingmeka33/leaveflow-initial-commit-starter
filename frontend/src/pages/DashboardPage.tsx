import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CircleCheck as CheckCircle, Circle as XCircle, CirclePlus as PlusCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import type { LeaveRequest } from '../lib/database.types';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { format } from 'date-fns';

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export function DashboardPage() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [recentRequests, setRecentRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.dashboard();
        setStats({ total: data.total, pending: data.pending, approved: data.approved, rejected: data.rejected });
        setRecentRequests(data.recentRequests ?? []);
      } finally {
        setLoading(false);
      }
    }
    if (profile) load();
  }, [profile]);

  const statCards = [
    { label: 'Total Requests', value: stats.total, icon: <Calendar size={20} />, color: 'var(--primary-600)', bg: 'var(--primary-50)' },
    { label: 'Pending', value: stats.pending, icon: <Clock size={20} />, color: 'var(--warning-600)', bg: 'var(--warning-50)' },
    { label: 'Approved', value: stats.approved, icon: <CheckCircle size={20} />, color: 'var(--success-600)', bg: 'var(--success-50)' },
    { label: 'Rejected', value: stats.rejected, icon: <XCircle size={20} />, color: 'var(--error-600)', bg: 'var(--error-50)' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', marginBottom: 4 }}>
            Good {getGreeting()}, {profile?.full_name?.split(' ')[0] ?? 'there'}
          </h1>
          <p style={{ color: 'var(--neutral-500)', fontSize: '0.9375rem' }}>
            {isAdmin ? 'Here\'s an overview of all leave requests.' : 'Here\'s the status of your leave requests.'}
          </p>
        </div>
        {!isAdmin && (
          <Link to="/my-leaves/new">
            <Button icon={<PlusCircle size={16} />}>New Request</Button>
          </Link>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {statCards.map(stat => (
          <Card key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--neutral-900)', lineHeight: 1 }}>{loading ? '—' : stat.value}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--neutral-500)', marginTop: 4 }}>{stat.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card padding={0}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={18} color="var(--neutral-600)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Recent Requests</h2>
          </div>
          <Link to={isAdmin ? '/admin/requests' : '/my-leaves'} style={{ fontSize: '0.875rem', color: 'var(--primary-600)', fontWeight: 500, textDecoration: 'none' }}>
            View all
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--neutral-400)' }}>Loading...</div>
        ) : recentRequests.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <Calendar size={40} color="var(--neutral-300)" style={{ marginBottom: 12 }} />
            <p style={{ color: 'var(--neutral-500)' }}>No leave requests yet.</p>
            {!isAdmin && (
              <Link to="/my-leaves/new" style={{ marginTop: 12, display: 'inline-block' }}>
                <Button size="sm" icon={<PlusCircle size={14} />} style={{ marginTop: 12 }}>Create your first request</Button>
              </Link>
            )}
          </div>
        ) : (
          <div>
            {recentRequests.map((req, i) => (
              <div key={req.id} style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: i < recentRequests.length - 1 ? '1px solid var(--neutral-100)' : 'none', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {isAdmin && (
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--neutral-700)', marginBottom: 2 }}>
                      {req.profiles?.full_name ?? 'Unknown'}
                      {req.profiles?.department && (
                        <span style={{ color: 'var(--neutral-400)', fontWeight: 400 }}> · {req.profiles.department}</span>
                      )}
                    </div>
                  )}
                  <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--neutral-800)' }}>
                    {req.leave_types?.name ?? 'Leave'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--neutral-400)', marginTop: 2 }}>
                    {format(new Date(req.start_date), 'MMM d')} – {format(new Date(req.end_date), 'MMM d, yyyy')}
                    {' · '}{req.days_count} day{req.days_count !== 1 ? 's' : ''}
                  </div>
                </div>
                <Badge status={req.status} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
