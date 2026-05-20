import { useEffect, useState } from 'react';
import { Users, Search, Calendar } from 'lucide-react';
import { api } from '../lib/api';
import type { Profile } from '../lib/database.types';
import { Card } from '../components/Card';

interface EmployeeStats extends Profile {
  pending: number;
  approved: number;
  total: number;
}

export function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        setEmployees(await api.employees() as EmployeeStats[]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = employees.filter(e => {
    if (!search) return true;
    const q = search.toLowerCase();
    return e.full_name.toLowerCase().includes(q) || (e.department ?? '').toLowerCase().includes(q);
  });

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Employees</h1>
        <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem' }}>Overview of all employees and their leave activity.</p>
      </div>

      <div style={{ position: 'relative', maxWidth: 360, marginBottom: 20 }}>
        <Search size={15} color="var(--neutral-400)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or department..." style={{ width: '100%', padding: '8px 12px 8px 34px', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius)', fontSize: '0.875rem', outline: 'none', background: 'var(--neutral-0)' }} />
      </div>

      {loading ? (
        <Card><div style={{ padding: 48, textAlign: 'center', color: 'var(--neutral-400)' }}>Loading...</div></Card>
      ) : filtered.length === 0 ? (
        <Card>
          <div style={{ padding: 48, textAlign: 'center' }}>
            <Users size={40} color="var(--neutral-300)" style={{ marginBottom: 12 }} />
            <p style={{ color: 'var(--neutral-500)' }}>No employees found.</p>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map(emp => {
            const initials = emp.full_name ? emp.full_name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() : '?';
            return (
              <Card key={emp.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-full)', background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-700)', flexShrink: 0 }}>
                    {initials}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--neutral-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{emp.full_name || 'Unnamed'}</div>
                    {emp.department && <div style={{ fontSize: '0.8rem', color: 'var(--neutral-400)' }}>{emp.department}</div>}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {[{ label: 'Total', value: emp.total ?? 0, color: 'var(--neutral-600)' }, { label: 'Pending', value: emp.pending ?? 0, color: 'var(--warning-600)' }, { label: 'Approved', value: emp.approved ?? 0, color: 'var(--success-600)' }].map(s => (
                    <div key={s.label} style={{ background: 'var(--neutral-50)', borderRadius: 'var(--radius)', padding: '10px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--neutral-400)', marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--neutral-400)', fontSize: '0.75rem' }}>
                  <Calendar size={12} />
                  Member since {new Date(emp.created_at).getFullYear()}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
