'use client';
import { useState } from 'react';
import { Warehouse, Plus } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import { formatDate } from '@/lib/helpers';
import inventoryData from '@/data/inventory.json';

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const filtered = inventoryData.filter(i => i.material.toLowerCase().includes(search.toLowerCase()) || i.supplier.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-5">
      <PageHeader title="Material Inventory" subtitle={`${inventoryData.length} material types`} icon={<Warehouse size={18} />}
        action={<button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"><Plus size={16} />Add Material</button>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search materials..." />
      <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--muted)] border-b border-[var(--border)]">
              <tr>{['Material', 'Stock', 'Unit', 'Last Purchase', 'Supplier'].map(h => <th key={h} className="text-left text-xs font-semibold text-[var(--muted-foreground)] px-4 py-3 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--accent)] transition-colors">
                  <td className="px-4 py-3 font-medium text-sm text-[var(--foreground)]">{item.material}</td>
                  <td className="px-4 py-3"><span className="font-bold text-orange-500">{item.stock}</span></td>
                  <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">{item.unit}</td>
                  <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">{formatDate(item.lastPurchase)}</td>
                  <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">{item.supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
