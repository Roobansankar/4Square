'use client';
import { useState } from 'react';
import { HardHat, Plus } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import supervisorsData from '@/data/supervisors.json';

export default function SupervisorsPage() {
  const [search, setSearch] = useState('');
  const filtered = supervisorsData.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.site.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-5">
      <PageHeader title="Site Supervisors" subtitle={`${supervisorsData.length} supervisors`} icon={<HardHat size={18} />}
        action={<button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"><Plus size={16} />Add Supervisor</button>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search supervisors..." />
      <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--muted)] border-b border-[var(--border)]">
            <tr>{['Name', 'Assigned Site', 'Workers', 'Progress'].map(h => <th key={h} className="text-left text-xs font-semibold text-[var(--muted-foreground)] px-4 py-3">{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--accent)] transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 font-bold text-xs">
                      {s.name.split(' ').map(w=>w[0]).join('')}
                    </div>
                    <span className="font-medium text-sm text-[var(--foreground)]">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-xs text-[var(--muted-foreground)]">{s.site}</td>
                <td className="px-4 py-4"><span className="font-semibold text-[var(--foreground)]">{s.workers}</span><span className="text-xs text-[var(--muted-foreground)] ml-1">workers</span></td>
                <td className="px-4 py-4 min-w-[160px]">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2.5 bg-[var(--muted)] rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{width:`${s.progress}%`}} />
                    </div>
                    <span className="text-xs font-semibold text-[var(--foreground)] w-9 shrink-0">{s.progress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
