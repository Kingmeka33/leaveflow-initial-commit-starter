import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Send, FileUp, X } from 'lucide-react';
import { api } from '../lib/api';
import type { LeaveType } from '../lib/database.types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { differenceInBusinessDays, parseISO } from 'date-fns';

export function NewLeaveRequestPage() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [form, setForm] = useState({
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const types = await api.leaveTypes();
        setLeaveTypes(types);
        if (types.length > 0) setForm(f => ({ ...f, leaveTypeId: types[0].id }));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load leave types');
      }
    }
    load();
  }, []);

  const days = useMemo(() => {
    if (!form.startDate || !form.endDate) return 0;
    const count = differenceInBusinessDays(parseISO(form.endDate), parseISO(form.startDate)) + 1;
    return count > 0 ? count : 0;
  }, [form.startDate, form.endDate]);

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function handleFileChange(file: File | null) {
    setError('');
    if (!file) {
      setDocumentFile(null);
      return;
    }

    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowed.includes(file.type)) {
      setError('Only PDF, JPG and PNG files are allowed.');
      return;
    }

    if (file.size > maxSize) {
      setError('Document must be 5MB or smaller.');
      return;
    }

    setDocumentFile(file);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.leaveTypeId || !form.startDate || !form.endDate) {
      setError('Please complete all required fields.');
      return;
    }

    if (days <= 0) {
      setError('End date must be after start date.');
      return;
    }

    setLoading(true);
    try {
      const body = new FormData();
      body.append('leaveTypeId', form.leaveTypeId);
      body.append('startDate', form.startDate);
      body.append('endDate', form.endDate);
      body.append('reason', form.reason);
      if (documentFile) body.append('document', documentFile);

      await api.createLeave(body);
      navigate('/my-leaves');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>New Leave Request</h1>
        <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem' }}>Submit a new time-off request for approval.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={labelStyle}>Leave Type</label>
            <select
              value={form.leaveTypeId}
              onChange={e => set('leaveTypeId', e.target.value)}
              required
              style={inputStyle}
            >
              {leaveTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Start Date</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={15} color="var(--neutral-400)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="date"
                  value={form.startDate}
                  onChange={e => set('startDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  style={{ ...inputStyle, paddingLeft: 36 }}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>End Date</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={15} color="var(--neutral-400)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="date"
                  value={form.endDate}
                  onChange={e => set('endDate', e.target.value)}
                  min={form.startDate || new Date().toISOString().split('T')[0]}
                  required
                  style={{ ...inputStyle, paddingLeft: 36 }}
                />
              </div>
            </div>
          </div>

          {days > 0 && (
            <div style={{
              padding: '12px 16px',
              background: 'var(--primary-50)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--primary-100)',
              color: 'var(--primary-700)',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}>
              Duration: <strong>{days} business day{days !== 1 ? 's' : ''}</strong>
            </div>
          )}

          <div>
            <label style={labelStyle}>Reason <span style={{ color: 'var(--neutral-400)', fontWeight: 400 }}>(optional)</span></label>
            <textarea
              value={form.reason}
              onChange={e => set('reason', e.target.value)}
              placeholder="Briefly describe the reason for your leave..."
              rows={4}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 96 }}
            />
          </div>

          <div>
            <label style={labelStyle}>Supporting Document <span style={{ color: 'var(--neutral-400)', fontWeight: 400 }}>(PDF, JPG, PNG up to 5MB)</span></label>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              border: '1px dashed var(--neutral-300)',
              borderRadius: 'var(--radius)',
              padding: '14px 16px',
              background: 'var(--neutral-50)',
              cursor: 'pointer',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--neutral-600)', fontSize: '0.875rem' }}>
                <FileUp size={18} color="var(--primary-600)" />
                {documentFile ? documentFile.name : 'Upload reason for leave document'}
              </span>
              <span style={{ color: 'var(--primary-600)', fontWeight: 600, fontSize: '0.875rem' }}>Choose file</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                onChange={e => handleFileChange(e.target.files?.[0] ?? null)}
                style={{ display: 'none' }}
              />
            </label>
            {documentFile && (
              <button
                type="button"
                onClick={() => setDocumentFile(null)}
                style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: 'var(--error-600)', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                <X size={13} /> Remove file
              </button>
            )}
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: 'var(--error-50)', border: '1px solid var(--error-100)', borderRadius: 'var(--radius)', color: 'var(--error-700)', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" loading={loading} icon={<Send size={15} />}>Submit Request</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--neutral-700)',
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  border: '1px solid var(--neutral-200)',
  borderRadius: 'var(--radius)',
  fontSize: '0.9375rem',
  color: 'var(--neutral-800)',
  background: 'var(--neutral-0)',
  outline: 'none',
};
