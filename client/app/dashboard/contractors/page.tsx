'use client';
import { useState } from 'react';
import { Wrench, Plus, Phone } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import contractorsData from '@/data/contractors.json';

export default function ContractorsPage() {
  const [search, setSearch] = useState('');
  const filtered = contractorsData.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.specialization.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-5">
      <PageHeader title="Contractors" subtitle={`${contractorsData.length} contractors`} icon={<Wrench size={18} />}
        action={<button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"><Plus size={16} />Add Contractor</button>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search contractors..." />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(c => (
          <div key={c.id} className="card-hover bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center"><Wrench size={18} className="text-orange-600" /></div>
              <div>
                <div className="font-semibold text-sm text-[var(--foreground)]">{c.name}</div>
                <div className="text-xs text-orange-500 font-medium">{c.specialization}</div>
              </div>
            </div>
            <div className="space-y-2 pt-3 border-t border-[var(--border)]">
              <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]"><Phone size={11} className="text-orange-500" />{c.contact}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--muted-foreground)]">Running Projects</span>
                <span className="text-sm font-bold text-orange-500">{c.runningProjects}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
