import type { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  padding?: number | string;
}

export function Card({ children, style, padding = 24 }: CardProps) {
  return (
    <div style={{
      background: 'var(--neutral-0)',
      border: '1px solid var(--neutral-200)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      padding,
      ...style,
    }}>
      {children}
    </div>
  );
}
