'use client';
import { useState } from 'react';
import { UserCheck, Plus, Phone } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import StatusBadge from '@/components/StatusBadge';
import engineersData from '@/data/engineers.json';

export default function EngineersPage() {
  const [search, setSearch] = useState('');
  const filtered = engineersData.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.designation.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="space-y-5">
      <PageHeader title="Site Engineers" subtitle={`${engineersData.length} engineers`} icon={<UserCheck size={18} />}
        action={<button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"><Plus size={16} />Add Engineer</button>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search engineers..." />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(e => (
          <div key={e.id} className="card-hover bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-orange-500/30">
                {e.avatar}
              </div>
              <div>
                <div className="font-semibold text-[var(--foreground)]">{e.name}</div>
                <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{e.designation}</div>
                <StatusBadge status={e.status} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[var(--border)]">
              <div className="text-center p-2 bg-[var(--muted)] rounded-lg">
                <div className="text-lg font-bold text-orange-500">{e.projects}</div>
                <div className="text-[10px] text-[var(--muted-foreground)]">Projects</div>
              </div>
              <div className="text-center p-2 bg-[var(--muted)] rounded-lg flex flex-col items-center justify-center">
                <Phone size={13} className="text-orange-500 mb-1" />
                <div className="text-[10px] text-[var(--muted-foreground)] truncate w-full text-center">{e.phone}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
