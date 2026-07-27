'use client';

import { Collapse, Table, Tag, Button, Space as AntSpace, Typography, Avatar } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatCurrency } from '@/lib/helpers';
import type { TeamCategoryGroup, TeamMember, StaffCategory } from '@/types/team';

const { Text } = Typography;

const statusColors: Record<string, string> = {
  Active: 'green',
  'On Leave': 'orange',
  Inactive: 'default',
};

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
  const columns = [
    {
      title: 'Member',
      dataIndex: 'name',
      key: 'name',
      render: (_: string, record: TeamMember) => (
        <AntSpace>
          <Avatar size={32} style={{ backgroundColor: '#f97316', verticalAlign: 'middle' }}>
            {initials(record.name)}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: 13 }}>{record.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.role}</Text>
          </div>
        </AntSpace>
      ),
    },
    { title: 'Phone', dataIndex: 'phone', key: 'phone', width: 120 },
    { title: 'Experience', dataIndex: 'experience', key: 'experience', width: 100 },
    {
      title: 'Daily Wage',
      dataIndex: 'dailyWage',
      key: 'dailyWage',
      width: 110,
      render: (val: number) => formatCurrency(val),
    },
    { title: 'Joining Date', dataIndex: 'joiningDate', key: 'joiningDate', width: 110 },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    { title: 'Assigned Site', dataIndex: 'assignedSite', key: 'assignedSite', width: 140 },
    {
      title: 'Current Task',
      dataIndex: 'currentTask',
      key: 'currentTask',
      ellipsis: true,
      width: 160,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 110,
      render: (_: unknown, record: TeamMember) => (
        <AntSpace size={4}>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => onViewMember(record)} />
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => onEditMember(record)} />
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => onDeleteMember(record)} />
        </AntSpace>
      ),
    },
  ];

  return (
    <Collapse
      defaultActiveKey={defaultOpen ? group.category : undefined}
      items={[
        {
          key: group.category,
          label: (
            <AntSpace>
              <Text strong>{group.category}</Text>
              <Tag>{group.members.length}</Tag>
            </AntSpace>
          ),
          extra: (
            <Button type="primary" ghost size="small" icon={<PlusOutlined />} onClick={(e) => { e.stopPropagation(); onAddMember(); }}>
              Add Member
            </Button>
          ),
          children: group.members.length > 0 ? (
            <Table
              dataSource={group.members}
              columns={columns}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 'max-content' }}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#999' }}>
              No members in this category yet.
            </div>
          ),
        },
      ]}
      style={{ background: '#fff', borderRadius: 8 }}
    />
  );
}
