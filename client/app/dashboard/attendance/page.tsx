'use client';
import { CalendarDays } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import attendanceData from '@/data/attendance.json';
import { calcPercent } from '@/lib/helpers';

export default function AttendancePage() {
  const { today, sites } = attendanceData;
  const pct = calcPercent(today.present, today.total);

  return (
    <div className="space-y-5">
      <PageHeader title="Attendance" subtitle={`Today: ${today.date}`} icon={<CalendarDays size={18} />} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Workers', value: today.total, color: 'text-[var(--foreground)]' },
          { label: 'Present', value: today.present, color: 'text-green-600' },
          { label: 'Absent', value: today.absent, color: 'text-red-500' },
        ].map((s, i) => (
          <div key={i} className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] p-5 text-center">
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-[var(--muted-foreground)] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Overall Attendance Rate</h3>
          <span className="text-xl font-bold text-orange-500">{pct}%</span>
        </div>
        <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Site-wise Attendance</h3>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {sites.map((site, i) => {
            const sitePct = calcPercent(site.present, site.workers);
            return (
              <div key={i} className="px-5 py-4 hover:bg-[var(--accent)] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[var(--foreground)]">{site.site}</span>
                  <span className="text-xs text-[var(--muted-foreground)]">{site.present}/{site.workers} present</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${sitePct >= 90 ? 'bg-green-500' : sitePct >= 75 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${sitePct}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-[var(--foreground)] w-9 shrink-0">{sitePct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
