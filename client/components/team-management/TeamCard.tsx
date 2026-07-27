'use client';

import { Users, Building2, UserCog } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import type { Team } from '@/types/team';

interface TeamCardProps {
  team: Team;
  memberCount: number;
  selected: boolean;
  onSelect: () => void;
}

export default function TeamCard({ team, memberCount, selected, onSelect }: TeamCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-xl border p-4 transition-colors ${
        selected
          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
          : 'border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)]'
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[var(--foreground)]">{team.name}</h3>
        <StatusBadge status={team.status} />
      </div>
      <div className="mt-3 space-y-1.5 text-sm text-[var(--muted-foreground)]">
        <div className="flex items-center gap-2">
          <Building2 size={14} />
          <span>Project : {team.project}</span>
        </div>
        <div className="flex items-center gap-2">
          <UserCog size={14} />
          <span>Leader : {team.leader}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={14} />
          <span>Total Members : {memberCount}</span>
        </div>
      </div>
    </button>
  );
}
