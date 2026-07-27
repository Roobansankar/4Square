'use client';
import PageHeader from '@/components/PageHeader';
import { Construction } from 'lucide-react';

export default function Page() {
  return (
    <div className="space-y-5">
      <PageHeader title="Module" subtitle="Under development" icon={<Construction size={18} />} />
      <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
          <Construction size={28} className="text-orange-500" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Coming Soon</h3>
        <p className="text-sm text-[var(--muted-foreground)] max-w-xs">This module is currently being developed. Check back soon.</p>
      </div>
    </div>
  );
}
