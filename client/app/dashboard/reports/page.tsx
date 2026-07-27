'use client';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { RevenueLineChart, ExpenseBreakdownChart, MonthlyExpensesChart } from '@/components/Charts';
import { formatCurrency } from '@/lib/helpers';

const reportStats = [
  { label: 'Total Revenue', value: 9610000, icon: <DollarSign size={18} className="text-green-600" />, color: 'bg-green-100 dark:bg-green-900/30', trend: '+12%', up: true },
  { label: 'Total Expenses', value: 5847000, icon: <TrendingDown size={18} className="text-red-500" />, color: 'bg-red-100 dark:bg-red-900/30', trend: '+8%', up: false },
  { label: 'Net Profit', value: 3763000, icon: <TrendingUp size={18} className="text-orange-600" />, color: 'bg-orange-100 dark:bg-orange-900/30', trend: '+18%', up: true },
  { label: 'Pending Payments', value: 850000, icon: <Clock size={18} className="text-yellow-600" />, color: 'bg-yellow-100 dark:bg-yellow-900/30', trend: '-5%', up: false },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reports & Analytics" subtitle="Financial and project performance overview" icon={<BarChart3 size={18} />} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {reportStats.map((s, i) => (
          <div key={i} className="card-hover bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
            <div className="text-xs text-[var(--muted-foreground)] font-medium mb-1">{s.label}</div>
            <div className="text-xl font-bold text-[var(--foreground)]">{formatCurrency(s.value)}</div>
            <div className={`text-xs font-semibold mt-1 ${s.up ? 'text-green-600' : 'text-red-500'}`}>
              {s.up ? '↑' : '↓'} {s.trend} vs last year
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] p-5">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">Monthly Revenue Trend</h3>
          <p className="text-xs text-[var(--muted-foreground)] mb-4">2024 revenue performance</p>
          <RevenueLineChart />
        </div>
        <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] p-5">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">Expense Breakdown</h3>
          <p className="text-xs text-[var(--muted-foreground)] mb-4">By category</p>
          <ExpenseBreakdownChart />
        </div>
      </div>

      <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] p-5">
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">Revenue vs Expenses – 2024</h3>
        <p className="text-xs text-[var(--muted-foreground)] mb-4">Monthly comparison</p>
        <MonthlyExpensesChart />
      </div>
    </div>
  );
}
