'use client';

import Modal from './Modal';
import StatusBadge from '@/components/StatusBadge';
import { formatCurrency } from '@/lib/helpers';
import type { TeamMember } from '@/types/team';

interface MemberViewModalProps {
  member: TeamMember;
  category: string;
  onClose: () => void;
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
}

export default function MemberViewModal({ member, category, onClose }: MemberViewModalProps) {
  const rows: Array<[string, string]> = [
    ['Role', member.role],
    ['Category', category],
    ['Phone Number', member.phone],
    ['Experience', member.experience],
    ['Daily Wage', formatCurrency(member.dailyWage)],
    ['Joining Date', member.joiningDate],
    ['Assigned Site', member.assignedSite],
    ['Current Task', member.currentTask || '—'],
  ];

  return (
    <Modal title={member.name} subtitle="Member details" onClose={onClose} width="max-w-md">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-lg font-semibold text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
          {initials(member.name)}
        </div>
        <div>
          <p className="font-semibold text-[var(--foreground)]">{member.name}</p>
          <StatusBadge status={member.status} />
        </div>
      </div>
      <div className="space-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 border-b border-[var(--border)] pb-2">
            <span className="text-[var(--muted-foreground)]">{label}</span>
            <span className="font-medium text-[var(--foreground)] text-right">{value}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}
