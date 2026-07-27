'use client';

import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color: string;
  trend?: string;
  trendUp?: boolean;
}

export default function StatsCard({ title, value, subtitle, icon, color, trend, trendUp }: StatsCardProps) {
  return (
    <div className="card-hover bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] p-4 flex items-start gap-3 cursor-default">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-medium text-[var(--muted-foreground)] uppercase tracking-wider">{title}</div>
        <div className="text-lg font-bold text-[var(--foreground)] mt-0.5 leading-none">{value}</div>
        {trend && (
          <div className={`text-[11px] font-medium mt-1 ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </div>
        )}
      </div>
    </div>
  );
}
