'use client';
import { useState } from 'react';
import { CreditCard, Plus } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import StatusBadge from '@/components/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/helpers';
import paymentsData from '@/data/payments.json';

export default function PaymentsPage() {
  const [search, setSearch] = useState('');
  const filtered = paymentsData.filter(p => p.vendor.toLowerCase().includes(search.toLowerCase()));
  const totalPaid = paymentsData.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
  const totalPending = paymentsData.filter(p => p.status !== 'Paid').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-5">
      <PageHeader title="Payments" subtitle="Vendor payment records" icon={<CreditCard size={18} />}
        action={<button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"><Plus size={16} />Record Payment</button>} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Payments', value: formatCurrency(paymentsData.reduce((s,p)=>s+p.amount,0)), color: 'text-[var(--foreground)]' },
          { label: 'Paid', value: formatCurrency(totalPaid), color: 'text-green-600' },
          { label: 'Pending', value: formatCurrency(totalPending), color: 'text-orange-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] p-4">
            <div className="text-xs text-[var(--muted-foreground)] mb-1">{stat.label}</div>
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search payments..." />
      <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--muted)] border-b border-[var(--border)]">
            <tr>{['ID', 'Vendor', 'Amount', 'Paid Date', 'Mode', 'Status'].map(h => <th key={h} className="text-left text-xs font-semibold text-[var(--muted-foreground)] px-4 py-3">{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--accent)] transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-orange-600 font-semibold">{p.id}</td>
                <td className="px-4 py-3 font-medium text-xs text-[var(--foreground)]">{p.vendor}</td>
                <td className="px-4 py-3 font-semibold text-sm text-[var(--foreground)]">{formatCurrency(p.amount)}</td>
                <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">{formatDate(p.paidDate)}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 bg-[var(--muted)] text-xs rounded-lg text-[var(--foreground)]">{p.mode}</span></td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
