'use client';

import { useEffect, useMemo, useState } from 'react';
import { Row, Col, Card, Statistic, Input, Select, Button, Tag, Typography, Space, Empty, Popconfirm, message, App } from 'antd';
import {
  TeamOutlined, UserOutlined, UserAddOutlined, PlusOutlined,
  CheckCircleOutlined, BuildOutlined, GroupOutlined,
} from '@ant-design/icons';
import PageHeader from '@/components/PageHeader';
import TeamCard from '@/components/team-management/TeamCard';
import CategoryAccordion from '@/components/team-management/CategoryAccordion';
import TeamFormModal from '@/components/team-management/TeamFormModal';
import MemberFormModal from '@/components/team-management/MemberFormModal';
import MemberViewModal from '@/components/team-management/MemberViewModal';
import teamsData from '@/data/teams.json';
import { STAFF_CATEGORIES, type StaffCategory, type Team, type TeamMember, type TeamStatus } from '@/types/team';

const { Text } = Typography;

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

  const [messageApi, contextHolder] = message.useMessage();

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
    messageApi.success(`Team "${data.name}" created`);
  };

  const handleSaveMember = (category: StaffCategory, member: TeamMember) => {
    if (!selectedTeam) return;
    updateTeam(selectedTeam.id, (team) => ({
      ...team,
      categories: team.categories.map((group) => {
        if (group.category !== category) {
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
    messageApi.success(`Member "${member.name}" saved`);
  };

  const handleDeleteMember = (category: StaffCategory, member: TeamMember) => {
    if (!selectedTeam) return;
    updateTeam(selectedTeam.id, (team) => ({
      ...team,
      categories: team.categories.map((group) =>
        group.category === category ? { ...group, members: group.members.filter((m) => m.id !== member.id) } : group
      ),
    }));
    messageApi.success(`Member "${member.name}" removed`);
  };

  return (
    <div>
      {contextHolder}
      <PageHeader
        title="Team Management"
        subtitle="Create and manage construction teams and their staff"
        icon={<TeamOutlined />}
        action={
          <Space wrap>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowTeamForm(true)}>
              Create Team
            </Button>
            <Button
              icon={<UserAddOutlined />}
              onClick={() => {
                if (!selectedTeam) { messageApi.warning('Select a team first'); return; }
                setMemberModal({ mode: 'add', category: STAFF_CATEGORIES[0], lockCategory: false });
              }}
            >
              Add Staff
            </Button>
          </Space>
        }
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={12} lg={6}>
          <Card size="small">
            <Statistic title="Total Teams" value={summary.totalTeams} prefix={<GroupOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card size="small">
            <Statistic title="Total Members" value={summary.totalMembers} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card size="small">
            <Statistic title="Active Members" value={summary.activeMembers} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#16a34a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card size="small">
            <Statistic title="Projects Assigned" value={summary.totalProjects} prefix={<BuildOutlined />} valueStyle={{ color: '#2563eb' }} />
          </Card>
        </Col>
      </Row>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <Input.Search
          placeholder="Search team, project, or leader"
          allowClear
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
        <Select
          value={statusFilter}
          onChange={(val) => setStatusFilter(val as 'All' | TeamStatus)}
          style={{ width: 130 }}
          options={[
            { value: 'All', label: 'All Status' },
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' },
          ]}
        />
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
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
              <Card>
                <Empty description="No teams match your search/filter." />
              </Card>
            )}
          </Space>
        </Col>

        <Col xs={24} lg={16}>
          {selectedTeam ? (
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Card size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Text strong style={{ fontSize: 16 }}>{selectedTeam.name}</Text>
                  <Tag color={selectedTeam.status === 'Active' ? 'green' : 'default'}>{selectedTeam.status}</Tag>
                </div>
                <Row gutter={[16, 8]}>
                  <Col span={12} lg={8}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Project Assigned</Text>
                    <br />
                    <Text>{selectedTeam.project}</Text>
                  </Col>
                  <Col span={12} lg={8}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Team Leader</Text>
                    <br />
                    <Text>{selectedTeam.leader}</Text>
                  </Col>
                  <Col span={12} lg={8}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Created Date</Text>
                    <br />
                    <Text>{selectedTeam.createdDate}</Text>
                  </Col>
                  <Col span={12} lg={8}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Total Members</Text>
                    <br />
                    <Text>{countMembers(selectedTeam)}</Text>
                  </Col>
                </Row>
              </Card>

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
            </Space>
          ) : (
            <Card>
              <Empty description="Select a team from the left to view its details." />
            </Card>
          )}
        </Col>
      </Row>

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
