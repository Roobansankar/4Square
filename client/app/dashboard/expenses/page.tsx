'use client';
import { useState } from 'react';
import { Wallet, Plus } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import { formatCurrency, formatDate } from '@/lib/helpers';
import expensesData from '@/data/expenses.json';

export default function ExpensesPage() {
  const [search, setSearch] = useState('');
  const filtered = expensesData.filter(e => e.category.toLowerCase().includes(search.toLowerCase()) || e.site.toLowerCase().includes(search.toLowerCase()));
  const total = expensesData.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-5">
      <PageHeader title="Expenses" subtitle={`Total: ${formatCurrency(total)}`} icon={<Wallet size={18} />}
        action={<button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"><Plus size={16} />Add Expense</button>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search expenses..." />
      <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--muted)] border-b border-[var(--border)]">
            <tr>{['ID', 'Category', 'Amount', 'Site', 'Date'].map(h => <th key={h} className="text-left text-xs font-semibold text-[var(--muted-foreground)] px-4 py-3">{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--accent)] transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-orange-600 font-semibold">{e.id}</td>
                <td className="px-4 py-3"><span className="px-2.5 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-full">{e.category}</span></td>
                <td className="px-4 py-3 font-semibold text-sm text-[var(--foreground)]">{formatCurrency(e.amount)}</td>
                <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">{e.site}</td>
                <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">{formatDate(e.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
