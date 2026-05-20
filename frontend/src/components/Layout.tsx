import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Calendar, LayoutDashboard, ClipboardList, Users, LogOut,
  Menu, X, ChevronRight, Bell,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  adminOnly?: boolean;
  employeeOnly?: Boolean;
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/my-leaves', label: 'My Leaves', icon: <Calendar size={18} />, employeeOnly: true },
  { to: '/admin/requests', label: 'All Requests', icon: <ClipboardList size={18} />, adminOnly: true },
  { to: '/admin/employees', label: 'Employees', icon: <Users size={18} />, adminOnly: true },
];

export function Layout({ children }: { children: ReactNode }) {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = profile?.role === 'admin';
  const visibleNav = navItems.filter(n => {
  if (n.adminOnly && !isAdmin) return false;
  if (n.employeeOnly && isAdmin) return false;
  return true;
});

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--neutral-50)' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: 256,
        background: 'var(--neutral-900)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: sidebarOpen ? 0 : -256,
        zIndex: 50,
        transition: 'left var(--transition-md)',
        '@media (min-width: 1024px)': { left: 0 },
      } as React.CSSProperties}>
        {/* Logo */}
        <div style={{
          padding: '24px 20px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius)',
            background: 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Calendar size={20} color="white" />
          </div>
          <span style={{ color: 'white', fontSize: '1.0625rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
            LeaveFlow
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'none' }}
            className="sidebar-close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {visibleNav.map(item => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  borderRadius: 'var(--radius)',
                  color: active ? 'white' : 'rgba(255,255,255,0.6)',
                  background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                  fontWeight: active ? 600 : 400,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'all var(--transition)',
                }}
              >
                {item.icon}
                {item.label}
                {active && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 8 }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'white',
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: 'white', fontSize: '0.875rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {profile?.full_name || 'User'}
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '1px 7px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                background: isAdmin ? 'rgba(59,130,246,0.25)' : 'rgba(34,197,94,0.2)',
                color: isAdmin ? '#93c5fd' : '#86efac',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginTop: 2,
              }}>
                {profile?.role}
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              borderRadius: 'var(--radius)',
              border: 'none',
              background: 'transparent',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all var(--transition)',
            }}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Desktop sidebar spacer */}
      <div style={{ width: 256, flexShrink: 0 }} className="sidebar-spacer" />

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          background: 'var(--neutral-0)',
          borderBottom: '1px solid var(--neutral-200)',
          padding: '0 24px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', color: 'var(--neutral-600)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            className="menu-button"
          >
            <Menu size={22} />
          </button>
          <span style={{ color: 'var(--neutral-300)', fontSize: '1.25rem' }}>|</span>
          <span style={{ color: 'var(--neutral-500)', fontSize: '0.875rem' }}>
            {visibleNav.find(n => n.to === location.pathname)?.label ?? 'LeaveFlow'}
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{ background: 'none', border: 'none', color: 'var(--neutral-500)', cursor: 'pointer', display: 'flex', alignItems: 'center', position: 'relative' }}>
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '32px 24px', maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .sidebar-spacer { display: block !important; }
          aside { left: 0 !important; }
          .menu-button { display: none !important; }
        }
        @media (max-width: 1023px) {
          .sidebar-spacer { display: none !important; }
          .menu-button { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
