'use client';

import { useState } from 'react';
import { ChevronDown, Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { formatCurrency } from '@/lib/helpers';
import type { TeamCategoryGroup, TeamMember } from '@/types/team';

interface CategoryAccordionProps {
  group: TeamCategoryGroup;
  defaultOpen?: boolean;
  onAddMember: () => void;
  onViewMember: (member: TeamMember) => void;
  onEditMember: (member: TeamMember) => void;
  onDeleteMember: (member: TeamMember) => void;
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
}

export default function CategoryAccordion({ group, defaultOpen, onAddMember, onViewMember, onEditMember, onDeleteMember }: CategoryAccordionProps) {
  const [open, setOpen] = useState(!!defaultOpen);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 font-semibold text-[var(--foreground)]">
          <ChevronDown size={16} className={`text-[var(--muted-foreground)] transition-transform ${open ? 'rotate-0' : '-rotate-90'}`} />
          {group.category}
          <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-xs font-medium text-[var(--muted-foreground)]">
            {group.members.length}
          </span>
        </span>
        <span
          role="button"
          onClick={(event) => { event.stopPropagation(); onAddMember(); }}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs font-semibold text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
        >
          <Plus size={13} /> Add Member
        </span>
      </button>

      {open && (
        group.members.length > 0 ? (
          <div className="overflow-x-auto border-t border-[var(--border)]">
            <table className="w-full text-sm">
              <thead className="bg-[var(--muted)]">
                <tr>
                  {['Member', 'Phone', 'Experience', 'Daily Wage', 'Joining Date', 'Status', 'Assigned Site', 'Current Task', 'Actions'].map((header) => (
                    <th key={header} className="whitespace-nowrap px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {group.members.map((member) => (
                  <tr key={member.id} className="border-t border-[var(--border)]">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                          {initials(member.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-[var(--foreground)]">{member.name}</p>
                          <p className="truncate text-xs text-[var(--muted-foreground)]">{member.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2">{member.phone}</td>
                    <td className="whitespace-nowrap px-3 py-2">{member.experience}</td>
                    <td className="whitespace-nowrap px-3 py-2">{formatCurrency(member.dailyWage)}</td>
                    <td className="whitespace-nowrap px-3 py-2">{member.joiningDate}</td>
                    <td className="whitespace-nowrap px-3 py-2"><StatusBadge status={member.status} /></td>
                    <td className="whitespace-nowrap px-3 py-2">{member.assignedSite}</td>
                    <td className="px-3 py-2 max-w-[180px] truncate" title={member.currentTask}>{member.currentTask}</td>
                    <td className="whitespace-nowrap px-3 py-2">
                      <div className="flex gap-1">
                        <button onClick={() => onViewMember(member)} className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"><Eye size={13} /></button>
                        <button onClick={() => onEditMember(member)} className="rounded-lg p-1.5 text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/30"><Edit2 size={13} /></button>
                        <button onClick={() => onDeleteMember(member)} className="rounded-lg p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border-t border-[var(--border)] px-4 py-6 text-center text-sm text-[var(--muted-foreground)]">
            No members in this category yet.
          </div>
        )
      )}
    </div>
  );
}
