'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Button, Tag, Progress, Descriptions, Typography, Space, Result, Skeleton,
  Tabs, Table, Avatar, Timeline, Statistic, Row, Col, Empty,
} from 'antd';
import {
  ArrowLeftOutlined, EditOutlined, FolderOpenOutlined, UserOutlined,
  DownloadOutlined, FileImageOutlined, FileTextOutlined,
} from '@ant-design/icons';
import PageHeader from '@/components/PageHeader';
import { formatCurrency, formatDate } from '@/lib/helpers';
import type { Project } from '@/types';

const { Text } = Typography;

const STORAGE_KEY = '4square-projects';

const statusColor: Record<string, string> = {
  Plan: 'blue',
  'In Progress': 'orange',
  Hold: 'gold',
};

const dummyTeam = [
  { id: 1, name: 'Arjun Sharma', role: 'Project Engineer', phone: '9840011111', status: 'Active' },
  { id: 2, name: 'Vikram Patel', role: 'Site Supervisor', phone: '9840022222', status: 'Active' },
  { id: 3, name: 'Ravi Kumar', role: 'Mason Contractor', phone: '9840033333', status: 'Active' },
  { id: 4, name: 'Naveen Raj', role: 'Electrical Contractor', phone: '9840044444', status: 'On Leave' },
];

const dummyBoqs = [
  { id: 1, boqNumber: 'BOQ-20260601-001', boqName: 'Foundation & Superstructure', status: 'Approved', grandTotal: 1260000 },
  { id: 2, boqNumber: 'BOQ-20260615-002', boqName: 'Electrical & Plumbing', status: 'Submitted', grandTotal: 420000 },
  { id: 3, boqNumber: 'BOQ-20260701-003', boqName: 'Interiors & Finishing', status: 'Draft', grandTotal: 680000 },
];

const dummyDrawings = [
  { id: 1, drawingNo: 'DRG-001', title: 'Ground Floor Plan', type: 'Architectural', revision: 'R2', date: '2026-05-10' },
  { id: 2, drawingNo: 'DRG-002', title: 'Structural Layout', type: 'Structural', revision: 'R1', date: '2026-05-18' },
  { id: 3, drawingNo: 'DRG-003', title: 'Electrical Wiring Plan', type: 'MEP', revision: 'R1', date: '2026-06-02' },
];

const dummyPurchases = [
  { id: 1, poNumber: 'PO-1001', vendor: 'Delta Cement', material: 'Cement (200 bags)', amount: 90000, status: 'Delivered' },
  { id: 2, poNumber: 'PO-1002', vendor: 'Steel Traders', material: 'TMT Steel (2 ton)', amount: 145000, status: 'Pending' },
  { id: 3, poNumber: 'PO-1003', vendor: 'City Hardware', material: 'Electrical Fittings', amount: 32000, status: 'Processing' },
];

const dummySiteUpdates = [
  { date: '2026-07-20', title: 'Roof slab casting completed', by: 'Vikram Patel' },
  { date: '2026-07-12', title: 'Brickwork for first floor started', by: 'Ravi Kumar' },
  { date: '2026-06-28', title: 'Foundation backfilling completed', by: 'Vikram Patel' },
  { date: '2026-06-15', title: 'Excavation completed', by: 'Arjun Sharma' },
];

const dummyReports = [
  { id: 1, name: 'Monthly Progress Report - June 2026', type: 'Progress', date: '2026-07-01' },
  { id: 2, name: 'Material Consumption Report', type: 'Materials', date: '2026-06-25' },
  { id: 3, name: 'Site Safety Audit Report', type: 'Safety', date: '2026-06-10' },
];

const boqStatusColor: Record<string, string> = { Draft: 'default', Submitted: 'blue', Approved: 'green' };
const poStatusColor: Record<string, string> = { Delivered: 'green', Pending: 'gold', Processing: 'blue' };

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null | undefined>(undefined);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const projects = stored ? (JSON.parse(stored) as Project[]) : [];
      setProject(projects.find((p) => p.id === id) ?? null);
    } catch {
      setProject(null);
    }
  }, [id]);

  if (project === undefined) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  if (project === null) {
    return (
      <Result
        status="404"
        title="Project not found"
        subTitle="This project may have been deleted or does not exist."
        extra={<Button type="primary" onClick={() => router.push('/dashboard/projects')}>Back to Projects</Button>}
      />
    );
  }

  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <Descriptions column={2} bordered size="middle">
          <Descriptions.Item label="Project ID">
            <Text code style={{ color: '#f97316' }}>{project.id}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={statusColor[project.status] || 'default'}>{project.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Client">{project.client}</Descriptions.Item>
          <Descriptions.Item label="Location">{project.location}</Descriptions.Item>
          <Descriptions.Item label="Email">{project.email || '—'}</Descriptions.Item>
          <Descriptions.Item label="Phone 1">{project.phone1 || '—'}</Descriptions.Item>
          <Descriptions.Item label="Phone 2">{project.phone2 || '—'}</Descriptions.Item>
          <Descriptions.Item label="Estimated Budget">{formatCurrency(project.estimatedBudget)}</Descriptions.Item>
          <Descriptions.Item label="Start Date">{project.startDate ? formatDate(project.startDate) : '—'}</Descriptions.Item>
          <Descriptions.Item label="End Date">{project.endDate ? formatDate(project.endDate) : '—'}</Descriptions.Item>
          <Descriptions.Item label="Progress" span={2}>
            <Progress
              percent={project.progress}
              style={{ width: 240 }}
              strokeColor={project.progress >= 100 ? '#52c41a' : '#f97316'}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={2}>
            {project.description || '—'}
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: 'team',
      label: 'Team',
      children: (
        <Table
          rowKey="id"
          dataSource={dummyTeam}
          pagination={false}
          columns={[
            {
              title: 'Name', dataIndex: 'name', key: 'name',
              render: (name: string) => (
                <Space><Avatar size="small" icon={<UserOutlined />} style={{ background: '#f97316' }} /><Text strong>{name}</Text></Space>
              ),
            },
            { title: 'Role', dataIndex: 'role', key: 'role' },
            { title: 'Phone', dataIndex: 'phone', key: 'phone' },
            {
              title: 'Status', dataIndex: 'status', key: 'status',
              render: (status: string) => <Tag color={status === 'Active' ? 'green' : 'gold'}>{status}</Tag>,
            },
          ]}
        />
      ),
    },
    {
      key: 'boq',
      label: 'BOQ',
      children: (
        <Table
          rowKey="id"
          dataSource={dummyBoqs}
          pagination={false}
          columns={[
            { title: 'BOQ No', dataIndex: 'boqNumber', key: 'boqNumber', render: (v: string) => <Text code style={{ color: '#f97316' }}>{v}</Text> },
            { title: 'BOQ Name', dataIndex: 'boqName', key: 'boqName' },
            { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={boqStatusColor[s] || 'default'}>{s}</Tag> },
            { title: 'Grand Total', dataIndex: 'grandTotal', key: 'grandTotal', align: 'right' as const, render: (v: number) => <Text strong>{formatCurrency(v)}</Text> },
          ]}
        />
      ),
    },
    {
      key: 'drawing',
      label: 'Drawing',
      children: (
        <Table
          rowKey="id"
          dataSource={dummyDrawings}
          pagination={false}
          columns={[
            { title: 'Drawing No', dataIndex: 'drawingNo', key: 'drawingNo' },
            { title: 'Title', dataIndex: 'title', key: 'title', render: (v: string) => <Space><FileImageOutlined style={{ color: '#1677ff' }} />{v}</Space> },
            { title: 'Type', dataIndex: 'type', key: 'type' },
            { title: 'Revision', dataIndex: 'revision', key: 'revision' },
            { title: 'Date', dataIndex: 'date', key: 'date', render: (v: string) => formatDate(v) },
          ]}
        />
      ),
    },
    {
      key: 'purchase',
      label: 'Purchase',
      children: (
        <Table
          rowKey="id"
          dataSource={dummyPurchases}
          pagination={false}
          columns={[
            { title: 'PO No', dataIndex: 'poNumber', key: 'poNumber', render: (v: string) => <Text code style={{ color: '#f97316' }}>{v}</Text> },
            { title: 'Vendor', dataIndex: 'vendor', key: 'vendor' },
            { title: 'Material', dataIndex: 'material', key: 'material' },
            { title: 'Amount', dataIndex: 'amount', key: 'amount', align: 'right' as const, render: (v: number) => <Text strong>{formatCurrency(v)}</Text> },
            { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={poStatusColor[s] || 'default'}>{s}</Tag> },
          ]}
        />
      ),
    },
    {
      key: 'site',
      label: 'Site',
      children: (
        <Timeline
          items={dummySiteUpdates.map((update) => ({
            children: (
              <div>
                <Text strong>{update.title}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>{formatDate(update.date)} · Reported by {update.by}</Text>
              </div>
            ),
          }))}
        />
      ),
    },
    {
      key: 'accounts',
      label: 'Accounts',
      children: (
        <div>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={8}>
              <Statistic title="Estimated Budget" value={project.estimatedBudget} formatter={(v) => formatCurrency(Number(v))} />
            </Col>
            <Col span={8}>
              <Statistic title="Amount Spent" value={project.estimatedBudget * (project.progress / 100)} formatter={(v) => formatCurrency(Number(v))} valueStyle={{ color: '#f97316' }} />
            </Col>
            <Col span={8}>
              <Statistic title="Balance" value={project.estimatedBudget * (1 - project.progress / 100)} formatter={(v) => formatCurrency(Number(v))} valueStyle={{ color: '#52c41a' }} />
            </Col>
          </Row>
          <Table
            rowKey="id"
            dataSource={dummyPurchases}
            pagination={false}
            columns={[
              { title: 'Reference', dataIndex: 'poNumber', key: 'poNumber' },
              { title: 'Paid To', dataIndex: 'vendor', key: 'vendor' },
              { title: 'Amount', dataIndex: 'amount', key: 'amount', align: 'right' as const, render: (v: number) => formatCurrency(v) },
              { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={poStatusColor[s] || 'default'}>{s}</Tag> },
            ]}
          />
        </div>
      ),
    },
    {
      key: 'reports',
      label: 'Reports',
      children: dummyReports.length ? (
        <Space direction="vertical" style={{ width: '100%' }} size={8}>
          {dummyReports.map((report) => (
            <div key={report.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 8, padding: 12 }}>
              <Space>
                <FileTextOutlined style={{ color: '#f97316', fontSize: 18 }} />
                <div>
                  <Text strong>{report.name}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>{report.type} · {formatDate(report.date)}</Text>
                </div>
              </Space>
              <Button type="text" icon={<DownloadOutlined />} />
            </div>
          ))}
        </Space>
      ) : (
        <Empty description="No reports yet" />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={project.name}
        subtitle={`${project.id} · ${project.client}`}
        icon={<FolderOpenOutlined />}
        action={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/dashboard/projects')}>Back</Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => router.push(`/dashboard/projects?edit=${project.id}`)}
            >
              Edit Project
            </Button>
          </Space>
        }
      />

      <div style={{ background: 'var(--card)', borderRadius: 12, padding: 24 }}>
        <Tabs defaultActiveKey="overview" items={tabItems} />
      </div>
    </div>
  );
}
