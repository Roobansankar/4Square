'use client';

import { useEffect, useMemo, useState } from 'react';
import { Users, UserPlus, Search, Building2, Layers, UserCheck } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import StatsCard from '@/components/StatsCard';
import StatusBadge from '@/components/StatusBadge';
import TeamCard from '@/components/team-management/TeamCard';
import CategoryAccordion from '@/components/team-management/CategoryAccordion';
import TeamFormModal from '@/components/team-management/TeamFormModal';
import MemberFormModal from '@/components/team-management/MemberFormModal';
import MemberViewModal from '@/components/team-management/MemberViewModal';
import teamsData from '@/data/teams.json';
import { STAFF_CATEGORIES, type StaffCategory, type Team, type TeamMember, type TeamStatus } from '@/types/team';

const STORAGE_KEY = '4square-teams';

type MemberModalState =
  | { mode: 'add'; category: StaffCategory; lockCategory: boolean }
  | { mode: 'edit'; category: StaffCategory; member: TeamMember };

function countMembers(team: Team) {
  return team.categories.reduce((sum, group) => sum + group.members.length, 0);
}

function emptyCategories() {
  return STAFF_CATEGORIES.map((category) => ({ category, members: [] as TeamMember[] }));
}

export default function TeamManagementPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | TeamStatus>('All');

  const [showTeamForm, setShowTeamForm] = useState(false);
  const [memberModal, setMemberModal] = useState<MemberModalState | null>(null);
  const [viewing, setViewing] = useState<{ member: TeamMember; category: string } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Team[];
      setTeams(parsed);
      setSelectedTeamId(parsed[0]?.id ?? null);
    } else {
      const seed = teamsData as Team[];
      setTeams(seed);
      setSelectedTeamId(seed[0]?.id ?? null);
    }
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded || typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
  }, [teams, hasLoaded]);

  const filteredTeams = useMemo(() => {
    const query = search.toLowerCase();
    return teams.filter((team) => {
      const matchesSearch = !query ||
        team.name.toLowerCase().includes(query) ||
        team.project.toLowerCase().includes(query) ||
        team.leader.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'All' || team.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [teams, search, statusFilter]);

  const selectedTeam = teams.find((team) => team.id === selectedTeamId) || null;

  const summary = useMemo(() => {
    const totalMembers = teams.reduce((sum, team) => sum + countMembers(team), 0);
    const activeMembers = teams.reduce(
      (sum, team) => sum + team.categories.reduce((s, g) => s + g.members.filter((m) => m.status === 'Active').length, 0),
      0
    );
    const projects = new Set(teams.map((team) => team.project));
    return { totalTeams: teams.length, totalMembers, activeMembers, totalProjects: projects.size };
  }, [teams]);

  const updateTeam = (teamId: string, updater: (team: Team) => Team) => {
    setTeams((prev) => prev.map((team) => (team.id === teamId ? updater(team) : team)));
  };

  const handleCreateTeam = (data: { name: string; project: string; leader: string; status: TeamStatus }) => {
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: data.name,
      project: data.project,
      leader: data.leader,
      createdDate: new Date().toISOString().slice(0, 10),
      status: data.status,
      categories: emptyCategories(),
    };
    setTeams((prev) => [newTeam, ...prev]);
    setSelectedTeamId(newTeam.id);
    setShowTeamForm(false);
  };

  const handleSaveMember = (category: StaffCategory, member: TeamMember) => {
    if (!selectedTeam) return;
    updateTeam(selectedTeam.id, (team) => ({
      ...team,
      categories: team.categories.map((group) => {
        if (group.category !== category) {
          // if editing moved out of this category's members list, drop stale copy
          return { ...group, members: group.members.filter((m) => m.id !== member.id) };
        }
        const exists = group.members.some((m) => m.id === member.id);
        return {
          ...group,
          members: exists
            ? group.members.map((m) => (m.id === member.id ? member : m))
            : [...group.members, member],
        };
      }),
    }));
    setMemberModal(null);
  };

  const handleDeleteMember = (category: StaffCategory, member: TeamMember) => {
    if (!selectedTeam) return;
    if (!window.confirm(`Remove ${member.name} from ${category}?`)) return;
    updateTeam(selectedTeam.id, (team) => ({
      ...team,
      categories: team.categories.map((group) =>
        group.category === category ? { ...group, members: group.members.filter((m) => m.id !== member.id) } : group
      ),
    }));
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Team Management"
        subtitle="Create and manage construction teams and their staff"
        icon={<Users size={18} />}
        action={
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowTeamForm(true)}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white"
            >
              <UserPlus size={16} /> Create Team
            </button>
            <button
              onClick={() => {
                if (!selectedTeam) { window.alert('Select a team first'); return; }
                setMemberModal({ mode: 'add', category: STAFF_CATEGORIES[0], lockCategory: false });
              }}
              className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)]"
            >
              <UserPlus size={16} /> Add Staff
            </button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Teams" value={summary.totalTeams} icon={<Layers size={20} className="text-white" />} color="bg-orange-500" />
        <StatsCard title="Total Members" value={summary.totalMembers} icon={<Users size={20} className="text-white" />} color="bg-slate-600" />
        <StatsCard title="Active Members" value={summary.activeMembers} icon={<UserCheck size={20} className="text-white" />} color="bg-green-600" />
        <StatsCard title="Projects Assigned" value={summary.totalProjects} icon={<Building2 size={20} className="text-white" />} color="bg-blue-600" />
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team, project, or leader"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] pl-9 pr-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['All', 'Active', 'Inactive'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                statusFilter === status ? 'bg-orange-500 text-white' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr] items-start">
        <div className="space-y-3">
          {filteredTeams.length ? (
            filteredTeams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                memberCount={countMembers(team)}
                selected={team.id === selectedTeamId}
                onSelect={() => setSelectedTeamId(team.id)}
              />
            ))
          ) : (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-center text-sm text-[var(--muted-foreground)]">
              No teams match your search/filter.
            </div>
          )}
        </div>

        <div className="space-y-4">
          {selectedTeam ? (
            <>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">{selectedTeam.name}</h2>
                  <StatusBadge status={selectedTeam.status} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                  <div><p className="text-[var(--muted-foreground)]">Project Assigned</p><p className="font-medium text-[var(--foreground)]">{selectedTeam.project}</p></div>
                  <div><p className="text-[var(--muted-foreground)]">Team Leader</p><p className="font-medium text-[var(--foreground)]">{selectedTeam.leader}</p></div>
                  <div><p className="text-[var(--muted-foreground)]">Created Date</p><p className="font-medium text-[var(--foreground)]">{selectedTeam.createdDate}</p></div>
                  <div><p className="text-[var(--muted-foreground)]">Total Members</p><p className="font-medium text-[var(--foreground)]">{countMembers(selectedTeam)}</p></div>
                </div>
              </div>

              <div className="space-y-3">
                {selectedTeam.categories.map((group) => (
                  <CategoryAccordion
                    key={group.category}
                    group={group}
                    defaultOpen={group.members.length > 0}
                    onAddMember={() => setMemberModal({ mode: 'add', category: group.category, lockCategory: true })}
                    onViewMember={(member) => setViewing({ member, category: group.category })}
                    onEditMember={(member) => setMemberModal({ mode: 'edit', category: group.category, member })}
                    onDeleteMember={(member) => handleDeleteMember(group.category, member)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-10 text-center text-sm text-[var(--muted-foreground)]">
              Select a team from the left to view its details.
            </div>
          )}
        </div>
      </div>

      {showTeamForm && (
        <TeamFormModal onSave={handleCreateTeam} onCancel={() => setShowTeamForm(false)} />
      )}

      {memberModal && selectedTeam && (
        <MemberFormModal
          initialData={memberModal.mode === 'edit' ? memberModal.member : null}
          initialCategory={memberModal.category}
          lockCategory={memberModal.mode === 'edit' ? true : memberModal.lockCategory}
          defaultSite={selectedTeam.project}
          onSave={handleSaveMember}
          onCancel={() => setMemberModal(null)}
        />
      )}

      {viewing && (
        <MemberViewModal member={viewing.member} category={viewing.category} onClose={() => setViewing(null)} />
      )}
    </div>
  );
}
