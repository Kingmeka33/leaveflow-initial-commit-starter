import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CirclePlus as PlusCircle, Calendar, Trash2, ListFilter as Filter, FileText } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import type { LeaveRequest, LeaveStatus } from '../lib/database.types';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { format } from 'date-fns';

export function MyLeavesPage() {
  const { profile } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<LeaveStatus | 'all'>('all');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, [profile]);

  async function load() {
    if (!profile) return;
    setLoading(true);
    try {
      setRequests(await api.myLeaves());
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Cancel this leave request?')) return;
    setDeleting(id);
    try {
      await api.cancelLeave(id);
      setRequests(r => r.filter(x => x.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>My Leave Requests</h1>
          <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem' }}>Track and manage your time-off requests.</p>
        </div>
        <Link to="/my-leaves/new">
          <Button icon={<PlusCircle size={16} />}>New Request</Button>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <Filter size={16} color="var(--neutral-500)" style={{ alignSelf: 'center' }} />
        {(['all', 'pending', 'approved', 'rejected'] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '5px 14px', borderRadius: 'var(--radius-full)', border: '1px solid', borderColor: filter === s ? 'var(--primary-500)' : 'var(--neutral-200)', background: filter === s ? 'var(--primary-50)' : 'var(--neutral-0)', color: filter === s ? 'var(--primary-700)' : 'var(--neutral-600)', fontSize: '0.8125rem', fontWeight: filter === s ? 600 : 400, cursor: 'pointer', transition: 'all var(--transition)', textTransform: 'capitalize' }}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <Card><div style={{ padding: 40, textAlign: 'center', color: 'var(--neutral-400)' }}>Loading...</div></Card>
      ) : filtered.length === 0 ? (
        <Card>
          <div style={{ padding: 48, textAlign: 'center' }}>
            <Calendar size={40} color="var(--neutral-300)" style={{ marginBottom: 12 }} />
            <p style={{ color: 'var(--neutral-500)', marginBottom: 16 }}>
              {filter === 'all' ? 'No leave requests yet.' : `No ${filter} requests.`}
            </p>
            <Link to="/my-leaves/new"><Button size="sm">Create your first request</Button></Link>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(req => (
            <Card key={req.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Calendar size={20} color="var(--primary-600)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--neutral-800)' }}>{req.leave_types?.name ?? 'Leave'}</span>
                  <Badge status={req.status} />
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--neutral-500)', marginBottom: 4 }}>
                  {format(new Date(req.start_date), 'MMMM d')} – {format(new Date(req.end_date), 'MMMM d, yyyy')}
                  <span style={{ margin: '0 6px', color: 'var(--neutral-300)' }}>·</span>
                  {req.days_count} day{req.days_count !== 1 ? 's' : ''}
                </div>
                {req.reason && <div style={{ fontSize: '0.8125rem', color: 'var(--neutral-500)', fontStyle: 'italic' }}>"{req.reason}"</div>}
                {req.document_url && (
                  <a href={req.document_url} target="_blank" rel="noreferrer" style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--primary-600)', fontSize: '0.8125rem', textDecoration: 'none', fontWeight: 500 }}>
                    <FileText size={14} /> View supporting document
                  </a>
                )}
                {req.review_comment && (
                  <div style={{ marginTop: 8, padding: '8px 12px', background: req.status === 'approved' ? 'var(--success-50)' : 'var(--error-50)', borderRadius: 'var(--radius)', fontSize: '0.8125rem', color: req.status === 'approved' ? 'var(--success-700)' : 'var(--error-700)' }}>
                    <strong>Review note:</strong> {req.review_comment}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--neutral-400)' }}>{format(new Date(req.created_at), 'MMM d, yyyy')}</span>
                {req.status === 'pending' && (
                  <Button variant="ghost" size="sm" loading={deleting === req.id} onClick={() => handleDelete(req.id)} style={{ color: 'var(--error-500)', padding: '6px' }}>
                    <Trash2 size={15} />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
