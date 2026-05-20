import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Building2, Calendar, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee' as 'admin' | 'employee',
    department: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const { error } = await signUp(form.email, form.password, form.fullName, form.role, form.department);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      navigate('/dashboard');
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--neutral-100) 100%)',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            borderRadius: 'var(--radius-xl)',
            background: 'var(--primary-600)',
            marginBottom: 16,
          }}>
            <Calendar size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: 8 }}>Create account</h1>
          <p style={{ color: 'var(--neutral-500)', fontSize: '0.9375rem' }}>Join LeaveFlow to manage leave requests</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={labelStyle}>Full name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Jane Smith" required style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@company.com" required style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Department</label>
              <div style={{ position: 'relative' }}>
                <Building2 size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" value={form.department} onChange={e => set('department', e.target.value)} placeholder="Engineering, HR, Sales..." style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Role</label>
              <div style={{ position: 'relative' }}>
                <Shield size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <select value={form.role} onChange={e => set('role', e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" required style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Confirm</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="••••••••" required style={inputStyle} />
                </div>
              </div>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: 'var(--error-50)', border: '1px solid var(--error-100)', borderRadius: 'var(--radius)', color: 'var(--error-700)', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} size="lg" style={{ width: '100%', marginTop: 4 }}>
              <UserPlus size={16} />
              Create account
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--neutral-500)', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 500 }}>Sign in</Link>
          </p>
        </Card>
      </div>
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
  padding: '9px 12px 9px 36px',
  border: '1px solid var(--neutral-200)',
  borderRadius: 'var(--radius)',
  fontSize: '0.9375rem',
  color: 'var(--neutral-800)',
  background: 'var(--neutral-0)',
  outline: 'none',
};
