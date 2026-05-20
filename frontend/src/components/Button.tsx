import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontWeight: 500,
    border: 'none',
    borderRadius: 'var(--radius)',
    transition: 'all var(--transition)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    whiteSpace: 'nowrap',
    ...(size === 'sm' && { padding: '6px 12px', fontSize: '0.8125rem' }),
    ...(size === 'md' && { padding: '9px 16px', fontSize: '0.875rem' }),
    ...(size === 'lg' && { padding: '11px 20px', fontSize: '1rem' }),
    ...(variant === 'primary' && {
      background: 'var(--primary-600)',
      color: '#fff',
    }),
    ...(variant === 'secondary' && {
      background: 'var(--neutral-100)',
      color: 'var(--neutral-700)',
      border: '1px solid var(--neutral-200)',
    }),
    ...(variant === 'danger' && {
      background: 'var(--error-600)',
      color: '#fff',
    }),
    ...(variant === 'ghost' && {
      background: 'transparent',
      color: 'var(--neutral-600)',
    }),
    ...(variant === 'success' && {
      background: 'var(--success-600)',
      color: '#fff',
    }),
    ...style,
  };

  return (
    <button disabled={disabled || loading} style={baseStyle} {...props}>
      {loading ? (
        <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
      ) : icon}
      {children}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}
