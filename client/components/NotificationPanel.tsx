'use client';

import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import notificationsData from '@/data/notifications.json';

interface Props { onClose: () => void; }

const typeIcon = (type: string) => {
  switch (type) {
    case 'success': return <CheckCircle size={14} className="text-green-500" />;
    case 'warning': return <AlertTriangle size={14} className="text-yellow-500" />;
    default: return <Info size={14} className="text-blue-500" />;
  }
};

export default function NotificationPanel({ onClose }: Props) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl z-50 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2 font-semibold text-sm text-[var(--foreground)]">
            <Bell size={15} className="text-orange-500" />Notifications
          </div>
          <button className="text-xs text-orange-500 flex items-center gap-1 hover:underline">
            <CheckCheck size={12} />Mark all read
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notificationsData.map(n => (
            <div key={n.id} className={`flex gap-3 px-4 py-3 border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)] transition-colors ${!n.read ? 'bg-orange-50/50 dark:bg-orange-900/10' : ''}`}>
              <div className="mt-0.5 shrink-0">{typeIcon(n.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1">
                  {n.title}
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />}
                </div>
                <div className="text-xs text-[var(--muted-foreground)] mt-0.5 leading-relaxed">{n.message}</div>
                <div className="text-[10px] text-[var(--muted-foreground)] mt-1">{n.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-2.5 border-t border-[var(--border)]">
          <button className="w-full text-xs text-orange-500 font-medium hover:underline">View all notifications</button>
        </div>
      </div>
    </>
  );
}
