import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
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
      <div style={{ width: '100%', maxWidth: 440 }}>
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
          <h1 style={{ fontSize: '1.75rem', marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: 'var(--neutral-500)', fontSize: '0.9375rem' }}>Sign in to your LeaveFlow account</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={labelStyle}>Email address</label>
              <div style={inputWrapStyle}>
                <Mail size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div style={inputWrapStyle}>
                <Lock size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            {error && (
              <div style={{
                padding: '10px 14px',
                background: 'var(--error-50)',
                border: '1px solid var(--error-100)',
                borderRadius: 'var(--radius)',
                color: 'var(--error-700)',
                fontSize: '0.875rem',
              }}>
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} size="lg" style={{ width: '100%', marginTop: 4 }}>
              <LogIn size={16} />
              Sign in
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--neutral-500)', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary-600)', fontWeight: 500 }}>Create one</Link>
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

const inputWrapStyle: React.CSSProperties = {
  position: 'relative',
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
  transition: 'border-color var(--transition)',
};
