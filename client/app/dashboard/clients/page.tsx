'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Table, Button, Input, Select, Tag, Card, Row, Col, Statistic,
  Space, Typography, Drawer, Descriptions, Popconfirm, message, Empty,
} from 'antd';
import {
  PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined,
  CheckCircleOutlined, DownloadOutlined, PrinterOutlined,
  UserOutlined, TeamOutlined, UsergroupAddOutlined,
} from '@ant-design/icons';
import PageHeader from '@/components/PageHeader';
import ClientForm, { type ClientRecord } from '@/components/clients/ClientForm';

const { Text } = Typography;

const STORAGE_KEY = '4square-clients';

const statusColors: Record<string, string> = {
  Lead: 'geekblue',
  Active: 'green',
  Inactive: 'default',
  Confirmed: 'cyan',
};

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

export default function ClientsPage() {
  const [records, setRecords] = useState<ClientRecord[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ClientRecord | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ClientRecord | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setRecords(JSON.parse(stored) as ClientRecord[]);
    } else {
      setRecords([
        {
          id: 'client-sample-1',
          client_code: 'CL-20260716-101',
          client_name: 'Aarav Group',
          company_name: 'Aarav Group Pvt Ltd',
          client_type: 'Company',
          mobile: '9876543210',
          email: 'rohan@aaravgroup.com',
          address: '12, MG Road, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
          gst_number: '29ABCDE1234F1Z5',
          status: 'Confirmed',
          remarks: 'Premium client',
          created_at: '2026-07-16',
          updated_at: '2026-07-16',
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
  }, [records]);

  const filteredRecords = useMemo(() => {
    const query = search.toLowerCase();
    return records.filter((record) => {
      const matchesSearch = !query || [record.client_code, record.client_name, record.company_name, record.city, record.email, record.mobile].some((field) => field.toLowerCase().includes(query));
      const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  const handleSave = (record: ClientRecord) => {
    if (editingRecord) {
      setRecords((prev) => prev.map((item) => item.id === record.id ? record : item));
      messageApi.success('Client updated');
    } else {
      setRecords((prev) => [record, ...prev]);
      messageApi.success('Client created');
    }
    setDrawerOpen(false);
    setEditingRecord(null);
    setSelectedRecord(record);
  };

  const handleDelete = (id: string) => {
    setRecords((prev) => prev.filter((item) => item.id !== id));
    messageApi.success('Client deleted');
    if (selectedRecord?.id === id) setSelectedRecord(null);
  };

  const handleApprove = (id: string) => {
    setRecords((prev) => prev.map((item) => item.id === id ? { ...item, status: 'Confirmed', updated_at: new Date().toISOString().slice(0, 10) } : item));
    messageApi.success('Client confirmed');
  };

  const exportPdf = (record: ClientRecord) => {
    const content = `Client Profile\nCode: ${record.client_code}\nName: ${record.client_name}\nCompany: ${record.company_name}\nPhone: ${record.mobile}\nEmail: ${record.email}\nStatus: ${record.status}`;
    downloadFile(content, `${record.client_code}.txt`, 'text/plain;charset=utf-8;');
  };

  const exportExcel = (record: ClientRecord) => {
    const rows = [['Client Code', record.client_code], ['Client Name', record.client_name], ['Company', record.company_name], ['Phone', record.mobile], ['Email', record.email], ['Status', record.status]];
    downloadFile(rows.map((row) => row.join(',')).join('\n'), `${record.client_code}.csv`, 'text/csv;charset=utf-8;');
  };

  const openDrawer = (record?: ClientRecord) => {
    setEditingRecord(record ?? null);
    setDrawerOpen(true);
  };

  const columns = [
    {
      title: 'Client Code',
      dataIndex: 'client_code',
      key: 'client_code',
      width: 160,
      render: (val: string) => <Text code style={{ color: '#f97316' }}>{val}</Text>,
    },
    {
      title: 'Client Name',
      dataIndex: 'client_name',
      key: 'client_name',
      render: (val: string, record: ClientRecord) => (
        <Button type="link" style={{ padding: 0 }} onClick={() => setSelectedRecord(record)}>
          {val}
        </Button>
      ),
    },
    { title: 'Company', dataIndex: 'company_name', key: 'company_name', width: 180 },
    { title: 'Phone', dataIndex: 'mobile', key: 'mobile', width: 130 },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (val: string) => <Tag color={statusColors[val]}>{val}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_: unknown, record: ClientRecord) => (
        <Space size={4}>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => setSelectedRecord(record)} />
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openDrawer(record)} />
          <Button type="link" size="small" icon={<CheckCircleOutlined style={{ color: '#16a34a' }} />} onClick={() => handleApprove(record.id)} />
          <Popconfirm title="Delete this client?" onConfirm={() => handleDelete(record.id)} okText="Delete" cancelText="Cancel">
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <PageHeader
        title="Clients"
        subtitle="Manage client information"
        icon={<UserOutlined />}
        action={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openDrawer()}>
            Add Client
          </Button>
        }
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic title="Total Clients" value={records.length} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card size="small">
            <Statistic title="Active / Confirmed" value={records.filter((r) => r.status === 'Active' || r.status === 'Confirmed').length} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#16a34a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card size="small">
            <Statistic title="Leads" value={records.filter((r) => r.status === 'Lead').length} prefix={<UsergroupAddOutlined />} valueStyle={{ color: '#1677ff' }} />
          </Card>
        </Col>
      </Row>

      <Card size="small" style={{ marginBottom: 16 }} bodyStyle={{ padding: '12px 16px' }}>
        <Space wrap>
          <Input.Search
            placeholder="Search by code, name, company, city, or phone"
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 340 }}
          />
          <Select
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            style={{ width: 140 }}
            options={[
              { value: 'All', label: 'All Status' },
              { value: 'Lead', label: 'Lead' },
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
              { value: 'Confirmed', label: 'Confirmed' },
            ]}
          />
        </Space>
      </Card>

      <Card bodyStyle={{ padding: 0 }}>
        <Table
          dataSource={filteredRecords}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showTotal: (total) => `${total} clients total` }}
          size="middle"
          scroll={{ x: 'max-content' }}
          locale={{ emptyText: <Empty description="No clients found" /> }}
        />
      </Card>

      {selectedRecord && (
        <Card size="small" style={{ marginTop: 16 }}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong style={{ fontSize: 16 }}>{selectedRecord.client_name}</Text>
                <br />
                <Text type="secondary">{selectedRecord.client_code} · {selectedRecord.company_name}</Text>
              </div>
              <Tag color={statusColors[selectedRecord.status]}>{selectedRecord.status}</Tag>
            </div>
            <Descriptions size="small" column={{ xs: 1, sm: 2 }} bordered>
              <Descriptions.Item label="Phone">{selectedRecord.mobile}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedRecord.email}</Descriptions.Item>
              <Descriptions.Item label="City">{selectedRecord.city}</Descriptions.Item>
              <Descriptions.Item label="State">{selectedRecord.state}</Descriptions.Item>
              <Descriptions.Item label="Pincode">{selectedRecord.pincode}</Descriptions.Item>
              <Descriptions.Item label="GST">{selectedRecord.gst_number}</Descriptions.Item>
              <Descriptions.Item label="Address" span={2}>{selectedRecord.address}</Descriptions.Item>
              <Descriptions.Item label="Remarks" span={2}>{selectedRecord.remarks || '—'}</Descriptions.Item>
            </Descriptions>
            <Space>
              <Button icon={<DownloadOutlined />} onClick={() => exportPdf(selectedRecord)}>Export PDF</Button>
              <Button icon={<DownloadOutlined />} onClick={() => exportExcel(selectedRecord)}>Export Excel</Button>
              <Button icon={<PrinterOutlined />} onClick={() => window.print()}>Print</Button>
            </Space>
          </Space>
        </Card>
      )}

      <Drawer
        title={editingRecord ? 'Edit Client' : 'Create Client'}
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setEditingRecord(null); }}
        width={520}
        destroyOnClose
      >
        <ClientForm initialData={editingRecord} onSave={handleSave} onCancel={() => { setDrawerOpen(false); setEditingRecord(null); }} />
      </Drawer>
    </div>
  );
}
