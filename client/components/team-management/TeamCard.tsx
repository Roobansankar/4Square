'use client';

import { Card, Tag, Typography, Space } from 'antd';
import { TeamOutlined, BuildOutlined, UserOutlined } from '@ant-design/icons';
import type { Team } from '@/types/team';

const { Text } = Typography;

const statusColors: Record<string, string> = {
  Active: 'green',
  Inactive: 'default',
};

interface TeamCardProps {
  team: Team;
  memberCount: number;
  selected: boolean;
  onSelect: () => void;
}

export default function TeamCard({ team, memberCount, selected, onSelect }: TeamCardProps) {
  return (
    <Card
      size="small"
      hoverable
      onClick={onSelect}
      style={{
        cursor: 'pointer',
        borderColor: selected ? '#f97316' : undefined,
        background: selected ? '#fff7ed' : undefined,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text strong>{team.name}</Text>
        <Tag color={statusColors[team.status]}>{team.status}</Tag>
      </div>
      <Space direction="vertical" size={2}>
        <Text type="secondary" style={{ fontSize: 13 }}>
          <BuildOutlined style={{ marginRight: 6 }} />Project: {team.project}
        </Text>
        <Text type="secondary" style={{ fontSize: 13 }}>
          <UserOutlined style={{ marginRight: 6 }} />Leader: {team.leader}
        </Text>
        <Text type="secondary" style={{ fontSize: 13 }}>
          <TeamOutlined style={{ marginRight: 6 }} />Members: {memberCount}
        </Text>
      </Space>
    </Card>
  );
}
