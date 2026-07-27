'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, Button, Tag, Progress, Input, Select, Drawer, Form, DatePicker, InputNumber, Space, Typography, Popconfirm, message, Badge } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, FolderOpenOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import PageHeader from '@/components/PageHeader';
import { formatCurrency, formatDate } from '@/lib/helpers';
import projectsData from '@/data/projects.json';
import type { Project } from '@/types';

const { Text } = Typography;
const { TextArea } = Input;

const STORAGE_KEY = '4square-projects';
const DATA_VERSION = '2026';

function normalizeStatus(status?: string): Project['status'] {
  const normalized = status?.trim().toLowerCase();
  if (normalized === 'in progress' || normalized === 'inprogress' || normalized === 'active') {
    return 'In Progress';
  }
  if (normalized === 'hold') {
    return 'Hold';
  }
  if (normalized === 'plan') {
    return 'Plan';
  }
  return 'Plan';
}

function buildInitialProjects(): Project[] {
  return (projectsData as Array<Record<string, unknown>>).map((project, index) => ({
    id: String(project.id ?? `PRJ-${String(index + 1).padStart(3, '0')}`),
    name: String(project.name ?? 'Untitled Project'),
    client: String(project.client ?? 'Unknown Client'),
    location: String(project.location ?? 'Unassigned'),
    description: String(project.description ?? ''),
    email: '',
    phone1: '',
    phone2: '',
    status: normalizeStatus(String(project.status ?? '')),
    estimatedBudget: Number(project.budget ?? 0),
    progress: Number(project.completion ?? 0),
    startDate: String(project.startDate ?? ''),
    endDate: String(project.endDate ?? ''),
  }));
}

const statusColor: Record<string, string> = {
  Plan: 'blue',
  'In Progress': 'orange',
  Hold: 'gold',
};

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [hasLoaded, setHasLoaded] = useState(false);

  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editForm] = Form.useForm();
  const [dw, setDw] = useState(520);
  const openDrawer = (fn: () => void) => { setDw(window.innerWidth < 768 ? window.innerWidth - 1 : 520); fn(); };

  const [newDrawerOpen, setNewDrawerOpen] = useState(false);
  const [newForm] = Form.useForm();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedProjects = window.localStorage.getItem(STORAGE_KEY);
    const storedVersion = window.localStorage.getItem(`${STORAGE_KEY}_version`);

    if (storedProjects && storedVersion === DATA_VERSION) {
      try {
        const parsed = JSON.parse(storedProjects) as Project[];
        if (parsed.length > 0) {
          setProjects(parsed);
          setHasLoaded(true);
          return;
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    setProjects(buildInitialProjects());
    window.localStorage.setItem(`${STORAGE_KEY}_version`, DATA_VERSION);
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded || typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects, hasLoaded]);

  const filtered = projects.filter((project) => {
    const query = search.toLowerCase();
    const matchSearch = !query ||
      project.name.toLowerCase().includes(query) ||
      project.client.toLowerCase().includes(query) ||
      project.location.toLowerCase().includes(query) ||
      project.email.toLowerCase().includes(query);
    const matchFilter = filter === 'All' || project.status === filter;
    return matchSearch && matchFilter;
  });

  const openEditForm = (project: Project) => {
    setEditingProject(project);
    editForm.setFieldsValue({
      ...project,
      startDate: project.startDate ? dayjs(project.startDate) : null,
      endDate: project.endDate ? dayjs(project.endDate) : null,
    });
    openDrawer(() => setEditDrawerOpen(true));
  };

  useEffect(() => {
    if (!hasLoaded || typeof window === 'undefined') return;
    const editId = new URLSearchParams(window.location.search).get('edit');
    if (!editId) return;
    const project = projects.find((p) => p.id === editId);
    if (project) openEditForm(project);
    router.replace('/dashboard/projects');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLoaded]);

  const handleEditSubmit = (values: Record<string, unknown>) => {
    const raw = values as {
      name: string;
      client: string;
      location: string;
      description: string;
      email: string;
      phone1: string;
      phone2: string;
      status: Project['status'];
      estimatedBudget: number;
      progress: number;
      startDate: dayjs.Dayjs;
      endDate: dayjs.Dayjs;
    };

    if (!editingProject) return;

    const updated: Project = {
      ...editingProject,
      name: raw.name.trim(),
      client: raw.client.trim(),
      location: raw.location.trim(),
      description: raw.description?.trim() || '',
      email: raw.email?.trim() || '',
      phone1: raw.phone1?.trim() || '',
      phone2: raw.phone2?.trim() || '',
      status: raw.status || 'Plan',
      estimatedBudget: Number(raw.estimatedBudget) || 0,
      progress: Math.min(100, Math.max(0, Number(raw.progress) || 0)),
      startDate: raw.startDate ? raw.startDate.format('YYYY-MM-DD') : '',
      endDate: raw.endDate ? raw.endDate.format('YYYY-MM-DD') : '',
    };

    setProjects((prev) => prev.map((p) => (p.id === editingProject.id ? updated : p)));
    setEditDrawerOpen(false);
    setEditingProject(null);
    editForm.resetFields();
    message.success('Project updated');
  };

  const handleNewSubmit = (values: Record<string, unknown>) => {
    const raw = values as {
      name: string;
      client: string;
      location: string;
      description: string;
      email: string;
      phone1: string;
      phone2: string;
      status: Project['status'];
      estimatedBudget: number;
      progress: number;
      startDate: dayjs.Dayjs;
      endDate: dayjs.Dayjs;
    };

    const newProject: Project = {
      id: `PRJ-${Date.now()}`,
      name: raw.name.trim(),
      client: raw.client.trim(),
      location: raw.location.trim(),
      description: raw.description?.trim() || '',
      email: raw.email?.trim() || '',
      phone1: raw.phone1?.trim() || '',
      phone2: raw.phone2?.trim() || '',
      status: raw.status || 'Plan',
      estimatedBudget: Number(raw.estimatedBudget) || 0,
      progress: Math.min(100, Math.max(0, Number(raw.progress) || 0)),
      startDate: raw.startDate ? raw.startDate.format('YYYY-MM-DD') : '',
      endDate: raw.endDate ? raw.endDate.format('YYYY-MM-DD') : '',
    };

    setProjects((prev) => [newProject, ...prev]);
    setNewDrawerOpen(false);
    newForm.resetFields();
    message.success('Project created successfully');
  };

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    message.success('Project deleted');
  };

  const columns = [
    {
      title: '#',
      key: 'sno',
      width: 50,
      render: (_: unknown, __: unknown, index: number) => (
        <Text style={{ fontSize: 12, color: '#999' }}>{index + 1}</Text>
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 110,
      render: (id: string) => <Text code style={{ fontSize: 11, color: '#f97316' }}>{id}</Text>,
    },
    {
      title: 'Project',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      render: (name: string, record: Project) => (
        <div>
          <Text strong style={{ fontSize: 13 }}>{name}</Text>
          <div>
            {record.email && <Text type="secondary" style={{ fontSize: 11 }}>{record.email}</Text>}
          </div>
          {record.description && (
            <Text
              type="secondary"
              ellipsis={{ tooltip: record.description }}
              style={{ fontSize: 11, display: 'block', maxWidth: 200 }}
            >
              {record.description}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
      width: 130,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      width: 130,
    },
    {
      title: 'Budget',
      dataIndex: 'estimatedBudget',
      key: 'estimatedBudget',
      width: 130,
      align: 'right' as const,
      render: (budget: number) => <Text strong style={{ whiteSpace: 'nowrap' }}>{formatCurrency(budget)}</Text>,
      sorter: (a: Project, b: Project) => a.estimatedBudget - b.estimatedBudget,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Badge
          status={status === 'Plan' ? 'processing' : status === 'In Progress' ? 'warning' : 'default'}
          text={<Tag color={statusColor[status] || 'default'} style={{ margin: 0 }}>{status}</Tag>}
        />
      ),
      filters: [
        { text: 'Plan', value: 'Plan' },
        { text: 'In Progress', value: 'In Progress' },
        { text: 'Hold', value: 'Hold' },
      ],
      onFilter: (value: boolean | React.Key, record: Project) => record.status === value,
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      width: 180,
      render: (progress: number) => (
        <Space size={8}>
          <Progress
            percent={progress}
            size="small"
            showInfo={false}
            style={{ width: 90, margin: 0 }}
            strokeColor={progress >= 100 ? '#52c41a' : '#f97316'}
            railColor="#f0f0f0"
          />
          <Text style={{ fontSize: 12, color: '#888', fontVariantNumeric: 'tabular-nums' }}>{progress}%</Text>
        </Space>
      ),
    },
    {
      title: 'Start',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 100,
      render: (date: string) => <Text style={{ fontSize: 12 }}>{date ? formatDate(date) : '—'}</Text>,
    },
    {
      title: 'End',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 100,
      render: (date: string) => <Text style={{ fontSize: 12 }}>{date ? formatDate(date) : '—'}</Text>,
    },
    {
      title: '',
      key: 'actions',
      width: 120,
      render: (_: unknown, record: Project) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/dashboard/projects/${record.id}`)}
            style={{ color: '#1677ff' }}
            size="small"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEditForm(record)}
            style={{ color: '#f97316' }}
            size="small"
          />
          <Popconfirm
            title="Delete this project?"
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} total projects`}
        icon={<FolderOpenOutlined />}
        action={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openDrawer(() => setNewDrawerOpen(true))}>
            New Project
          </Button>
        }
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <Input.Search
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ width: '100%', maxWidth: 320 }}
        />
        <Select
          value={filter}
          onChange={setFilter}
          style={{ width: 140 }}
          options={[
            { value: 'All', label: 'All Status' },
            { value: 'Plan', label: 'Plan' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Hold', label: 'Hold' },
          ]}
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          bordered
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} projects`,
            size: 'small',
          }}
          locale={{
            emptyText: 'No projects found. Create your first project to get started.',
          }}
          style={{ background: '#fff', borderRadius: 12, minWidth: 800 }}
          size="middle"
          scroll={{ x: 'max-content' }}
        />
      </div>

      <Drawer
        title="New Project"
        placement="right"
        width={dw}
        open={newDrawerOpen}
        onClose={() => { setNewDrawerOpen(false); newForm.resetFields(); }}
        extra={
          <Space>
            <Button onClick={() => { setNewDrawerOpen(false); newForm.resetFields(); }}>Cancel</Button>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} onClick={() => newForm.submit()}>
              Save Project
            </Button>
          </Space>
        }
      >
        <Form
          form={newForm}
          layout="vertical"
          onFinish={handleNewSubmit}
          initialValues={{ status: 'Plan', progress: 0, estimatedBudget: 0 }}
          requiredMark={false}
        >
          <Form.Item label="Project name" name="name" rules={[{ required: true, message: 'Please enter project name' }]}>
            <Input placeholder="e.g. Skyline Villa" />
          </Form.Item>
          <Form.Item label="Client name" name="client" rules={[{ required: true, message: 'Please enter client name' }]}>
            <Input placeholder="Client name" />
          </Form.Item>
          <Form.Item label="Location" name="location" rules={[{ required: true, message: 'Please enter site location' }]}>
            <Input placeholder="Site location" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <TextArea rows={3} placeholder="Brief description of the project scope" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input placeholder="client@example.com" type="email" />
          </Form.Item>
          <Form.Item label="Phone 1" name="phone1">
            <Input placeholder="Phone 1" />
          </Form.Item>
          <Form.Item label="Phone 2" name="phone2">
            <Input placeholder="Phone 2" />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select>
              <Select.Option value="Plan">Plan</Select.Option>
              <Select.Option value="In Progress">In Progress</Select.Option>
              <Select.Option value="Hold">Hold</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Estimated budget (INR)" name="estimatedBudget">
            <InputNumber min={0} style={{ width: '100%' }} prefix="₹" placeholder="0" />
          </Form.Item>
          <Form.Item label="Progress (%)" name="progress">
            <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="0" />
          </Form.Item>
          <Form.Item label="Start date" name="startDate">
            <DatePicker style={{ width: '100%' }} format="DD MMM YYYY" />
          </Form.Item>
          <Form.Item label="End date" name="endDate">
            <DatePicker style={{ width: '100%' }} format="DD MMM YYYY" />
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="Edit Project"
        placement="right"
        width={dw}
        open={editDrawerOpen}
        onClose={() => { setEditDrawerOpen(false); setEditingProject(null); editForm.resetFields(); }}
        extra={
          <Space>
            <Button onClick={() => { setEditDrawerOpen(false); setEditingProject(null); editForm.resetFields(); }}>Cancel</Button>
            <Button type="primary" htmlType="submit" icon={<EditOutlined />} onClick={() => editForm.submit()}>
              Update Project
            </Button>
          </Space>
        }
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
          requiredMark={false}
        >
          <Form.Item label="Project name" name="name" rules={[{ required: true, message: 'Please enter project name' }]}>
            <Input placeholder="e.g. Skyline Villa" />
          </Form.Item>
          <Form.Item label="Client name" name="client" rules={[{ required: true, message: 'Please enter client name' }]}>
            <Input placeholder="Client name" />
          </Form.Item>
          <Form.Item label="Location" name="location" rules={[{ required: true, message: 'Please enter site location' }]}>
            <Input placeholder="Site location" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <TextArea rows={3} placeholder="Brief description of the project scope" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input placeholder="client@example.com" type="email" />
          </Form.Item>
          <Form.Item label="Phone 1" name="phone1">
            <Input placeholder="Phone 1" />
          </Form.Item>
          <Form.Item label="Phone 2" name="phone2">
            <Input placeholder="Phone 2" />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select>
              <Select.Option value="Plan">Plan</Select.Option>
              <Select.Option value="In Progress">In Progress</Select.Option>
              <Select.Option value="Hold">Hold</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Estimated budget (INR)" name="estimatedBudget">
            <InputNumber min={0} style={{ width: '100%' }} prefix="₹" placeholder="0" />
          </Form.Item>
          <Form.Item label="Progress (%)" name="progress">
            <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="0" />
          </Form.Item>
          <Form.Item label="Start date" name="startDate">
            <DatePicker style={{ width: '100%' }} format="DD MMM YYYY" />
          </Form.Item>
          <Form.Item label="End date" name="endDate">
            <DatePicker style={{ width: '100%' }} format="DD MMM YYYY" />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
