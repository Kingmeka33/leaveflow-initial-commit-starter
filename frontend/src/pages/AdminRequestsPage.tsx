import { useEffect, useState } from 'react';
import { CircleCheck as CheckCircle, Circle as XCircle, ListFilter as Filter, Search, MessageSquare, FileText } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import type { LeaveRequest, LeaveStatus } from '../lib/database.types';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { format } from 'date-fns';

export function AdminRequestsPage() {
  const { profile } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<LeaveStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [reviewModal, setReviewModal] = useState<{ req: LeaveRequest; action: 'approved' | 'rejected' } | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      setRequests(await api.allLeaves());
    } finally {
      setLoading(false);
    }
  }

  async function submitReview() {
    if (!reviewModal || !profile) return;
    setSubmitting(true);
    try {
      const updated = await api.reviewLeave(reviewModal.req.id, reviewModal.action, comment);
      setRequests(rs => rs.map(r => r.id === reviewModal.req.id ? updated : r));
      setReviewModal(null);
      setComment('');
    } finally {
      setSubmitting(false);
    }
  }

  const filtered = requests
    .filter(r => filter === 'all' || r.status === filter)
    .filter(r => {
      if (!search) return true;
      const name = r.profiles?.full_name?.toLowerCase() ?? '';
      const dept = r.profiles?.department?.toLowerCase() ?? '';
      const type = r.leave_types?.name?.toLowerCase() ?? '';
      const q = search.toLowerCase();
      return name.includes(q) || dept.includes(q) || type.includes(q);
    });

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>All Leave Requests</h1>
        <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem' }}>Review and manage employee leave requests.</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search size={15} color="var(--neutral-400)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, department, type..." style={{ width: '100%', padding: '8px 12px 8px 34px', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius)', fontSize: '0.875rem', outline: 'none', background: 'var(--neutral-0)' }} />
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Filter size={15} color="var(--neutral-500)" />
          {(['all', 'pending', 'approved', 'rejected'] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: '5px 12px', borderRadius: 'var(--radius-full)', border: '1px solid', borderColor: filter === s ? 'var(--primary-500)' : 'var(--neutral-200)', background: filter === s ? 'var(--primary-50)' : 'var(--neutral-0)', color: filter === s ? 'var(--primary-700)' : 'var(--neutral-600)', fontSize: '0.8rem', fontWeight: filter === s ? 600 : 400, cursor: 'pointer', textTransform: 'capitalize' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <Card padding={0}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--neutral-400)' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--neutral-500)' }}>No requests found.</div>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr auto', gap: 16, padding: '12px 24px', borderBottom: '1px solid var(--neutral-100)', background: 'var(--neutral-50)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--neutral-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <span>Employee</span><span>Leave Type</span><span>Dates</span><span>Status</span><span>Actions</span>
            </div>
            {filtered.map((req, i) => (
              <div key={req.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr auto', gap: 16, padding: '14px 24px', borderBottom: i < filtered.length - 1 ? '1px solid var(--neutral-100)' : 'none', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--neutral-800)' }}>{req.profiles?.full_name ?? '—'}</div>
                  {req.profiles?.department && <div style={{ fontSize: '0.8rem', color: 'var(--neutral-400)' }}>{req.profiles.department}</div>}
                  {req.document_url && (
                    <a href={req.document_url} target="_blank" rel="noreferrer" style={{ marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--primary-600)', fontSize: '0.75rem', textDecoration: 'none' }}>
                      <FileText size={12} /> Document
                    </a>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--neutral-700)' }}>{req.leave_types?.name ?? '—'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--neutral-400)' }}>{req.days_count} day{req.days_count !== 1 ? 's' : ''}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--neutral-700)' }}>{format(new Date(req.start_date), 'MMM d')} – {format(new Date(req.end_date), 'MMM d, yyyy')}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--neutral-400)' }}>Submitted {format(new Date(req.created_at), 'MMM d')}</div>
                </div>
                <div><Badge status={req.status} /></div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {req.status === 'pending' ? (
                    <>
                      <Button variant="success" size="sm" onClick={() => { setReviewModal({ req, action: 'approved' }); setComment(''); }} icon={<CheckCircle size={14} />}>Approve</Button>
                      <Button variant="danger" size="sm" onClick={() => { setReviewModal({ req, action: 'rejected' }); setComment(''); }} icon={<XCircle size={14} />}>Reject</Button>
                    </>
                  ) : (
                    req.review_comment && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--neutral-400)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={req.review_comment}>
                        <MessageSquare size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                        {req.review_comment}
                      </span>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {reviewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 }}>
          <Card style={{ width: '100%', maxWidth: 480 }}>
            <h2 style={{ fontSize: '1.125rem', marginBottom: 6 }}>{reviewModal.action === 'approved' ? 'Approve' : 'Reject'} Leave Request</h2>
            <p style={{ color: 'var(--neutral-500)', fontSize: '0.875rem', marginBottom: 20 }}>
              <strong>{reviewModal.req.profiles?.full_name}</strong>'s {reviewModal.req.leave_types?.name} ({reviewModal.req.days_count} days)
            </p>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--neutral-700)', marginBottom: 6 }}>Comment <span style={{ color: 'var(--neutral-400)', fontWeight: 400 }}>(optional)</span></label>
              <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a note to the employee..." rows={3} style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius)', fontSize: '0.9rem', resize: 'vertical', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setReviewModal(null)}>Cancel</Button>
              <Button variant={reviewModal.action === 'approved' ? 'success' : 'danger'} loading={submitting} onClick={submitReview} icon={reviewModal.action === 'approved' ? <CheckCircle size={15} /> : <XCircle size={15} />}>
                {reviewModal.action === 'approved' ? 'Approve' : 'Reject'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
