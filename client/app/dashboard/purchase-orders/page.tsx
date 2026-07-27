'use client';
import { useState } from 'react';
import { ShoppingBag, Plus } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import StatusBadge from '@/components/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/helpers';
import purchaseOrdersData from '@/data/purchaseOrders.json';

export default function PurchaseOrdersPage() {
  const [search, setSearch] = useState('');
  const filtered = purchaseOrdersData.filter(p => p.vendor.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-5">
      <PageHeader title="Purchase Orders" subtitle={`${purchaseOrdersData.length} orders`} icon={<ShoppingBag size={18} />}
        action={<button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"><Plus size={16} />New PO</button>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search purchase orders..." />
      <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--muted)] border-b border-[var(--border)]">
            <tr>{['PO Number', 'Vendor', 'Amount', 'Status', 'Date'].map(h => <th key={h} className="text-left text-xs font-semibold text-[var(--muted-foreground)] px-4 py-3">{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--accent)] transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-orange-600 font-semibold">{p.id}</td>
                <td className="px-4 py-3 font-medium text-xs text-[var(--foreground)]">{p.vendor}</td>
                <td className="px-4 py-3 font-semibold text-sm text-[var(--foreground)]">{formatCurrency(p.amount)}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">{formatDate(p.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
