'use client';

import { Modal, Descriptions, Tag, Avatar, Space, Typography } from 'antd';
import { formatCurrency } from '@/lib/helpers';
import type { TeamMember } from '@/types/team';

const { Text } = Typography;

const statusColors: Record<string, string> = {
  Active: 'green',
  'On Leave': 'orange',
  Inactive: 'default',
};

interface MemberViewModalProps {
  member: TeamMember;
  category: string;
  onClose: () => void;
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
}

export default function MemberViewModal({ member, category, onClose }: MemberViewModalProps) {
  return (
    <Modal title={null} open onCancel={onClose} footer={null} width={520}>
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Space>
          <Avatar size={56} style={{ backgroundColor: '#f97316', fontSize: 20 }}>
            {initials(member.name)}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: 16 }}>{member.name}</Text>
            <br />
            <Tag color={statusColors[member.status]}>{member.status}</Tag>
          </div>
        </Space>
        <Descriptions column={2} size="small" bordered>
          <Descriptions.Item label="Role">{member.role}</Descriptions.Item>
          <Descriptions.Item label="Category">{category}</Descriptions.Item>
          <Descriptions.Item label="Phone">{member.phone}</Descriptions.Item>
          <Descriptions.Item label="Experience">{member.experience}</Descriptions.Item>
          <Descriptions.Item label="Daily Wage">{formatCurrency(member.dailyWage)}</Descriptions.Item>
          <Descriptions.Item label="Joining Date">{member.joiningDate}</Descriptions.Item>
          <Descriptions.Item label="Assigned Site">{member.assignedSite}</Descriptions.Item>
          <Descriptions.Item label="Current Task" span={2}>{member.currentTask || '—'}</Descriptions.Item>
        </Descriptions>
      </Space>
    </Modal>
  );
}
