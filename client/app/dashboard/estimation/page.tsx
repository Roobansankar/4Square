'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Tag, Input, Select, Drawer, Form, DatePicker, InputNumber, Space, Typography, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, FolderOpenOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import PageHeader from '@/components/PageHeader';
import projectsData from '@/data/projects.json';
import estimationsData from '@/data/estimations.json';

const { Text } = Typography;
const { TextArea } = Input;

interface ProjectOption {
  id: string;
  name: string;
}

interface QuotationRecord {
  id: string;
  quoteNo: string;
  projectId: string;
  projectName: string;
  clientName: string;
  clientEmail: string;
  clientPhone1: string;
  clientPhone2: string;
  clientAddress: string;
  title: string;
  items: string;
  totalAmount: number;
  quotationDate: string;
  startDate: string;
  validTill: string;
  status: 'Draft' | 'Sent' | 'Approved' | 'Rejected' | 'Pending';
  notes: string;
  createdAt: string;
}

const STORAGE_KEY = '4square-estimations';
const PROJECTS_STORAGE_KEY = '4square-projects';

function buildInitialQuotations(): QuotationRecord[] {
  return estimationsData as QuotationRecord[];
}

function buildFallbackProjects(): ProjectOption[] {
  return (projectsData as Array<{ id?: string; name?: string }>)
    .filter((item) => item.id && item.name)
    .map((item) => ({ id: item.id!, name: item.name! }));
}

function generateQuoteNo(existing: QuotationRecord[]) {
  const day = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const todayCount = existing.filter((item) => item.quoteNo.includes(day)).length + 1;
  return `QT-${day}-${String(todayCount).padStart(3, '0')}`;
}

function escapePdfText(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function buildQuotePdf(quote: QuotationRecord) {
  const lines = [
    'Quotation',
    `Quote No: ${quote.quoteNo}`,
    `Project: ${quote.projectName}`,
    `Client: ${quote.clientName}`,
    `Email: ${quote.clientEmail || '—'}`,
    `Phone 1: ${quote.clientPhone1 || '—'}`,
    `Phone 2: ${quote.clientPhone2 || '—'}`,
    `Address: ${quote.clientAddress || '—'}`,
    `Title: ${quote.title}`,
    `Items: ${quote.items}`,
    `Total Amount: ${quote.totalAmount}`,
    `Quotation Date: ${quote.quotationDate || '—'}`,
    `Start Date: ${quote.startDate || '—'}`,
    `Valid Till: ${quote.validTill}`,
    `Status: ${quote.status}`,
    `Notes: ${quote.notes}`,
  ];

  const contentStream = lines
    .map((line, index) => `BT /F1 12 Tf 50 ${760 - index * 14} Td (${escapePdfText(line)}) Tj ET`)
    .join('\n');

  const stream = `${contentStream}`;
  const streamLength = stream.length;
  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj',
    `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${stream}\nendstream\nendobj`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += object + '\n';
  });

  const xrefOffset = pdf.length;
  pdf += 'xref\n';
  pdf += `0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += 'trailer\n';
  pdf += `<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
}

const statusColor: Record<string, string> = {
  Draft: 'default',
  Sent: 'blue',
  Approved: 'green',
  Rejected: 'red',
  Pending: 'gold',
};

export default function Page() {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [quotations, setQuotations] = useState<QuotationRecord[]>([]);
  const [search, setSearch] = useState('');

  const [newDrawerOpen, setNewDrawerOpen] = useState(false);
  const [newForm] = Form.useForm();

  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<QuotationRecord | null>(null);
  const [editForm] = Form.useForm();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const storedProjects = window.localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects) as Array<{ id?: string; name?: string }>;
        setProjects(parsedProjects.filter((item) => item.id && item.name).map((item) => ({ id: item.id!, name: item.name! })));
      } else {
        setProjects(buildFallbackProjects());
      }
    } catch {
      setProjects(buildFallbackProjects());
    }

    try {
      const storedQuotations = window.localStorage.getItem(STORAGE_KEY);
      if (storedQuotations) {
        const parsedQuotations = JSON.parse(storedQuotations) as QuotationRecord[];
        setQuotations(parsedQuotations.length > 0 ? parsedQuotations : buildInitialQuotations());
      } else {
        setQuotations(buildInitialQuotations());
      }
    } catch {
      setQuotations(buildInitialQuotations());
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quotations));
  }, [quotations]);

  const filteredQuotations = quotations.filter((quote) => {
    const query = search.toLowerCase();
    return !query || quote.quoteNo.toLowerCase().includes(query) || quote.projectName.toLowerCase().includes(query) || quote.clientName.toLowerCase().includes(query);
  });

  const openNewDrawer = () => {
    newForm.setFieldsValue({ quoteNo: generateQuoteNo(quotations), status: 'Draft' });
    setNewDrawerOpen(true);
  };

  const handleNewSubmit = (values: Record<string, unknown>) => {
    const raw = values as {
      quoteNo: string;
      projectId: string;
      clientName: string;
      clientEmail: string;
      clientPhone1: string;
      clientPhone2: string;
      clientAddress: string;
      title: string;
      items: string;
      totalAmount: number;
      quotationDate: dayjs.Dayjs;
      startDate: dayjs.Dayjs;
      validTill: dayjs.Dayjs;
      status: QuotationRecord['status'];
      notes: string;
    };

    const selectedProject = projects.find((p) => p.id === raw.projectId);
    if (!selectedProject) {
      message.error('Please select a project');
      return;
    }

    if (!raw.clientName?.trim() || !raw.title?.trim()) {
      message.error('Please enter client name and quotation title');
      return;
    }

    const payload: QuotationRecord = {
      id: `QT-${Date.now()}`,
      quoteNo: raw.quoteNo,
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      clientName: raw.clientName.trim(),
      clientEmail: raw.clientEmail?.trim() || '',
      clientPhone1: raw.clientPhone1?.trim() || '',
      clientPhone2: raw.clientPhone2?.trim() || '',
      clientAddress: raw.clientAddress?.trim() || '',
      title: raw.title.trim(),
      items: raw.items?.trim() || '',
      totalAmount: Number(raw.totalAmount) || 0,
      quotationDate: raw.quotationDate ? raw.quotationDate.format('YYYY-MM-DD') : '',
      startDate: raw.startDate ? raw.startDate.format('YYYY-MM-DD') : '',
      validTill: raw.validTill ? raw.validTill.format('YYYY-MM-DD') : '',
      status: raw.status || 'Draft',
      notes: raw.notes?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    setQuotations((prev) => [payload, ...prev]);
    setNewDrawerOpen(false);
    newForm.resetFields();
    message.success('Quotation created');
  };

  const openEditDrawer = (quote: QuotationRecord) => {
    setEditingQuote(quote);
    editForm.setFieldsValue({
      ...quote,
      quotationDate: quote.quotationDate ? dayjs(quote.quotationDate) : null,
      startDate: quote.startDate ? dayjs(quote.startDate) : null,
      validTill: quote.validTill ? dayjs(quote.validTill) : null,
    });
    setEditDrawerOpen(true);
  };

  const handleEditSubmit = (values: Record<string, unknown>) => {
    if (!editingQuote) return;

    const raw = values as {
      clientName: string;
      clientEmail: string;
      clientPhone1: string;
      clientPhone2: string;
      clientAddress: string;
      title: string;
      items: string;
      totalAmount: number;
      quotationDate: dayjs.Dayjs;
      startDate: dayjs.Dayjs;
      validTill: dayjs.Dayjs;
      status: QuotationRecord['status'];
      notes: string;
    };

    const updated: QuotationRecord = {
      ...editingQuote,
      clientName: raw.clientName.trim(),
      clientEmail: raw.clientEmail?.trim() || '',
      clientPhone1: raw.clientPhone1?.trim() || '',
      clientPhone2: raw.clientPhone2?.trim() || '',
      clientAddress: raw.clientAddress?.trim() || '',
      title: raw.title.trim(),
      items: raw.items?.trim() || '',
      totalAmount: Number(raw.totalAmount) || 0,
      quotationDate: raw.quotationDate ? raw.quotationDate.format('YYYY-MM-DD') : '',
      startDate: raw.startDate ? raw.startDate.format('YYYY-MM-DD') : '',
      validTill: raw.validTill ? raw.validTill.format('YYYY-MM-DD') : '',
      status: raw.status || 'Draft',
      notes: raw.notes?.trim() || '',
    };

    setQuotations((prev) => prev.map((q) => (q.id === editingQuote.id ? updated : q)));
    setEditDrawerOpen(false);
    setEditingQuote(null);
    editForm.resetFields();
    message.success('Quotation updated');
  };

  const handleDelete = (id: string) => {
    setQuotations((prev) => prev.filter((q) => q.id !== id));
    message.success('Quotation deleted');
  };

  const updateStatus = (id: string, status: QuotationRecord['status']) => {
    setQuotations((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
  };

  const downloadPdf = (quote: QuotationRecord) => {
    const blob = buildQuotePdf(quote);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${quote.quoteNo}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
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
      title: 'Quote No',
      dataIndex: 'quoteNo',
      key: 'quoteNo',
      width: 160,
      render: (no: string) => <Text code style={{ fontSize: 11, color: '#f97316' }}>{no}</Text>,
    },
    {
      title: 'Project',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 160,
    },
    {
      title: 'Client',
      dataIndex: 'clientName',
      key: 'clientName',
      width: 140,
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 130,
      align: 'right' as const,
      render: (amount: number) => <Text strong style={{ whiteSpace: 'nowrap' }}>₹{amount.toLocaleString()}</Text>,
      sorter: (a: QuotationRecord, b: QuotationRecord) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: string, record: QuotationRecord) => (
        <Select
          value={status}
          onChange={(val) => updateStatus(record.id, val as QuotationRecord['status'])}
          size="small"
          style={{ width: 100 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Select.Option value="Draft">Draft</Select.Option>
          <Select.Option value="Sent">Sent</Select.Option>
          <Select.Option value="Approved">Approved</Select.Option>
          <Select.Option value="Rejected">Rejected</Select.Option>
          <Select.Option value="Pending">Pending</Select.Option>
        </Select>
      ),
      filters: [
        { text: 'Draft', value: 'Draft' },
        { text: 'Sent', value: 'Sent' },
        { text: 'Approved', value: 'Approved' },
        { text: 'Rejected', value: 'Rejected' },
        { text: 'Pending', value: 'Pending' },
      ],
      onFilter: (value: boolean | React.Key, record: QuotationRecord) => record.status === value,
    },
    {
      title: 'Valid Till',
      dataIndex: 'validTill',
      key: 'validTill',
      width: 110,
      render: (date: string) => <Text style={{ fontSize: 12 }}>{date || '—'}</Text>,
    },
    {
      title: '',
      key: 'actions',
      width: 120,
      render: (_: unknown, record: QuotationRecord) => (
        <Space>
          <Button type="text" icon={<DownloadOutlined />} onClick={() => downloadPdf(record)} style={{ color: '#1677ff' }} size="small" />
          <Button type="text" icon={<EditOutlined />} onClick={() => openEditDrawer(record)} style={{ color: '#f97316' }} size="small" />
          <Popconfirm title="Delete this quotation?" onConfirm={() => handleDelete(record.id)} okText="Delete" cancelText="Cancel" okButtonProps={{ danger: true }}>
            <Button type="text" icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Estimation"
        subtitle="Create quotations, update status, and download PDF"
        icon={<FolderOpenOutlined />}
        action={
          <Button type="primary" icon={<PlusOutlined />} onClick={openNewDrawer}>
            New Quotation
          </Button>
        }
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <Input.Search
          placeholder="Search quote no, client, or project"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ width: 320 }}
        />
      </div>

      <Table
        dataSource={filteredQuotations}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} quotations`,
        }}
        locale={{
          emptyText: 'No quotations yet. Create one to get started.',
        }}
        style={{ background: '#fff', borderRadius: 12 }}
        size="middle"
      />

      <Drawer
        title="New Quotation"
        placement="right"
        width={640}
        open={newDrawerOpen}
        onClose={() => { setNewDrawerOpen(false); newForm.resetFields(); }}
        extra={
          <Space>
            <Button onClick={() => { setNewDrawerOpen(false); newForm.resetFields(); }}>Cancel</Button>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} onClick={() => newForm.submit()}>Save Quotation</Button>
          </Space>
        }
      >
        <Form form={newForm} layout="vertical" onFinish={handleNewSubmit} requiredMark={false}>
          <Form.Item label="Quote No" name="quoteNo">
            <Input readOnly style={{ background: '#f5f5f5' }} />
          </Form.Item>
          <Form.Item label="Project" name="projectId" rules={[{ required: true, message: 'Please select a project' }]}>
            <Select placeholder="Select project">
              {projects.map((p) => (
                <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Client name" name="clientName" rules={[{ required: true, message: 'Please enter client name' }]}>
            <Input placeholder="Client name" />
          </Form.Item>
          <Form.Item label="Quotation title" name="title" rules={[{ required: true, message: 'Please enter title' }]}>
            <Input placeholder="e.g. House Construction Estimate" />
          </Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item label="Email" name="clientEmail">
              <Input placeholder="client@example.com" type="email" />
            </Form.Item>
            <Form.Item label="Phone 1" name="clientPhone1">
              <Input placeholder="Phone 1" />
            </Form.Item>
            <Form.Item label="Phone 2" name="clientPhone2">
              <Input placeholder="Phone 2" />
            </Form.Item>
            <Form.Item label="Status" name="status">
              <Select>
                <Select.Option value="Draft">Draft</Select.Option>
                <Select.Option value="Sent">Sent</Select.Option>
                <Select.Option value="Approved">Approved</Select.Option>
                <Select.Option value="Rejected">Rejected</Select.Option>
                <Select.Option value="Pending">Pending</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Total amount (₹)" name="totalAmount">
              <InputNumber min={0} style={{ width: '100%' }} prefix="₹" placeholder="0" />
            </Form.Item>
            <Form.Item label="Quotation date" name="quotationDate">
              <DatePicker style={{ width: '100%' }} format="DD MMM YYYY" />
            </Form.Item>
            <Form.Item label="Start date" name="startDate">
              <DatePicker style={{ width: '100%' }} format="DD MMM YYYY" />
            </Form.Item>
            <Form.Item label="Valid till" name="validTill">
              <DatePicker style={{ width: '100%' }} format="DD MMM YYYY" />
            </Form.Item>
          </div>
          <Form.Item label="Client address" name="clientAddress">
            <TextArea rows={2} placeholder="Client address" />
          </Form.Item>
          <Form.Item label="Items / Scope" name="items">
            <TextArea rows={4} placeholder="Describe the scope of work or itemized estimate" />
          </Form.Item>
          <Form.Item label="Notes" name="notes">
            <TextArea rows={3} placeholder="Additional remarks" />
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="Edit Quotation"
        placement="right"
        width={640}
        open={editDrawerOpen}
        onClose={() => { setEditDrawerOpen(false); setEditingQuote(null); editForm.resetFields(); }}
        extra={
          <Space>
            <Button onClick={() => { setEditDrawerOpen(false); setEditingQuote(null); editForm.resetFields(); }}>Cancel</Button>
            <Button type="primary" htmlType="submit" icon={<EditOutlined />} onClick={() => editForm.submit()}>Update Quotation</Button>
          </Space>
        }
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSubmit} requiredMark={false}>
          <Form.Item label="Quote No">
            <Input value={editingQuote?.quoteNo} readOnly style={{ background: '#f5f5f5' }} />
          </Form.Item>
          <Form.Item label="Project">
            <Input value={editingQuote?.projectName} readOnly style={{ background: '#f5f5f5' }} />
          </Form.Item>
          <Form.Item label="Client name" name="clientName" rules={[{ required: true, message: 'Please enter client name' }]}>
            <Input placeholder="Client name" />
          </Form.Item>
          <Form.Item label="Quotation title" name="title" rules={[{ required: true, message: 'Please enter title' }]}>
            <Input placeholder="e.g. House Construction Estimate" />
          </Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item label="Email" name="clientEmail">
              <Input placeholder="client@example.com" type="email" />
            </Form.Item>
            <Form.Item label="Phone 1" name="clientPhone1">
              <Input placeholder="Phone 1" />
            </Form.Item>
            <Form.Item label="Phone 2" name="clientPhone2">
              <Input placeholder="Phone 2" />
            </Form.Item>
            <Form.Item label="Status" name="status">
              <Select>
                <Select.Option value="Draft">Draft</Select.Option>
                <Select.Option value="Sent">Sent</Select.Option>
                <Select.Option value="Approved">Approved</Select.Option>
                <Select.Option value="Rejected">Rejected</Select.Option>
                <Select.Option value="Pending">Pending</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Total amount (₹)" name="totalAmount">
              <InputNumber min={0} style={{ width: '100%' }} prefix="₹" placeholder="0" />
            </Form.Item>
            <Form.Item label="Quotation date" name="quotationDate">
              <DatePicker style={{ width: '100%' }} format="DD MMM YYYY" />
            </Form.Item>
            <Form.Item label="Start date" name="startDate">
              <DatePicker style={{ width: '100%' }} format="DD MMM YYYY" />
            </Form.Item>
            <Form.Item label="Valid till" name="validTill">
              <DatePicker style={{ width: '100%' }} format="DD MMM YYYY" />
            </Form.Item>
          </div>
          <Form.Item label="Client address" name="clientAddress">
            <TextArea rows={2} placeholder="Client address" />
          </Form.Item>
          <Form.Item label="Items / Scope" name="items">
            <TextArea rows={4} placeholder="Describe the scope of work or itemized estimate" />
          </Form.Item>
          <Form.Item label="Notes" name="notes">
            <TextArea rows={3} placeholder="Additional remarks" />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
