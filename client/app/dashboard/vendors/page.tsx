'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Input, Select, Drawer, Form, Space, Typography, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ShopOutlined } from '@ant-design/icons';
import PageHeader from '@/components/PageHeader';
import vendorsData from '@/data/vendors.json';

const { Text } = Typography;

interface VendorRecord {
  id: string;
  vendorName: string;
  gstNumber: string;
  contactNumber: string;
  additionalNumber: string;
  address: string;
  state: string;
  country: string;
  category: 'Electrical' | 'Plumbing' | 'Painter' | 'Extra';
}

const STORAGE_KEY = '4square-vendors';

const categoryColors: Record<string, string> = {
  Electrical: 'blue',
  Plumbing: 'cyan',
  Painter: 'orange',
  Extra: 'default',
};

export default function VendorsPage() {
  const [vendors, setVendors] = useState<VendorRecord[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorRecord | null>(null);
  const [form] = Form.useForm();
  const [dw, setDw] = useState(520);

  const openDrawer = (fn: () => void) => {
    setDw(window.innerWidth < 768 ? window.innerWidth - 1 : 520);
    fn();
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setVendors(JSON.parse(stored) as VendorRecord[]);
      } else {
        const initial: VendorRecord[] = (vendorsData as Array<Record<string, unknown>>).map((vendor, index) => ({
          id: String(vendor.id ?? `VEN-${index + 1}`),
          vendorName: String(vendor.vendor ?? 'Vendor'),
          gstNumber: String(vendor.gst ?? ''),
          contactNumber: String(vendor.phone ?? ''),
          additionalNumber: '',
          address: '',
          state: '',
          country: 'India',
          category: 'Electrical',
        }));
        setVendors(initial);
      }
    } catch {
      setVendors([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(vendors));
  }, [vendors]);

  const filtered = vendors.filter((vendor) => {
    const query = search.toLowerCase();
    const matchSearch = !query ||
      vendor.vendorName.toLowerCase().includes(query) ||
      vendor.category.toLowerCase().includes(query) ||
      vendor.gstNumber.toLowerCase().includes(query) ||
      vendor.contactNumber.toLowerCase().includes(query);
    const matchFilter = filter === 'All' || vendor.category === filter;
    return matchSearch && matchFilter;
  });

  const openNewForm = () => {
    setEditingVendor(null);
    form.resetFields();
    form.setFieldsValue({ category: 'Electrical', country: 'India' });
    openDrawer(() => setDrawerOpen(true));
  };

  const openEditForm = (vendor: VendorRecord) => {
    setEditingVendor(vendor);
    form.setFieldsValue(vendor);
    openDrawer(() => setDrawerOpen(true));
  };

  const handleDelete = (id: string) => {
    setVendors((prev) => prev.filter((v) => v.id !== id));
    message.success('Vendor deleted');
  };

  const handleSubmit = (values: Record<string, unknown>) => {
    const raw = values as unknown as VendorRecord;
    const payload: VendorRecord = {
      id: editingVendor?.id || `VEN-${Date.now()}`,
      vendorName: raw.vendorName.trim(),
      gstNumber: raw.gstNumber?.trim() || '',
      contactNumber: raw.contactNumber.trim(),
      additionalNumber: raw.additionalNumber?.trim() || '',
      address: raw.address?.trim() || '',
      state: raw.state?.trim() || '',
      country: raw.country?.trim() || 'India',
      category: raw.category || 'Electrical',
    };

    if (!payload.vendorName || !payload.contactNumber) {
      message.error('Please enter vendor name and contact number');
      return;
    }

    if (editingVendor) {
      setVendors((prev) => prev.map((v) => (v.id === editingVendor.id ? payload : v)));
      message.success('Vendor updated');
    } else {
      setVendors((prev) => [payload, ...prev]);
      message.success('Vendor added successfully');
    }

    setDrawerOpen(false);
    setEditingVendor(null);
    form.resetFields();
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
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
      width: 200,
      render: (name: string) => <Text strong style={{ fontSize: 13 }}>{name}</Text>,
    },
    {
      title: 'GST Number',
      dataIndex: 'gstNumber',
      key: 'gstNumber',
      width: 160,
      render: (gst: string) => gst
        ? <Text code style={{ fontSize: 11 }}>{gst}</Text>
        : <Text type="secondary" style={{ fontSize: 12 }}>—</Text>,
    },
    {
      title: 'Contact',
      dataIndex: 'contactNumber',
      key: 'contactNumber',
      width: 160,
      render: (phone: string, record: VendorRecord) => (
        <div>
          <Text style={{ fontSize: 13 }}>{phone}</Text>
          {record.additionalNumber && (
            <div><Text type="secondary" style={{ fontSize: 11 }}>{record.additionalNumber}</Text></div>
          )}
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (cat: string) => <Tag color={categoryColors[cat] || 'default'}>{cat}</Tag>,
      filters: [
        { text: 'Electrical', value: 'Electrical' },
        { text: 'Plumbing', value: 'Plumbing' },
        { text: 'Painter', value: 'Painter' },
        { text: 'Extra', value: 'Extra' },
      ],
      onFilter: (value: boolean | React.Key, record: VendorRecord) => record.category === value,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 200,
      render: (addr: string, record: VendorRecord) => (
        <div>
          {addr && <Text style={{ fontSize: 12 }}>{addr}</Text>}
          <div>
            {[record.state, record.country].filter(Boolean).join(', ') && (
              <Text type="secondary" style={{ fontSize: 11 }}>
                {[record.state, record.country].filter(Boolean).join(', ')}
              </Text>
            )}
          </div>
        </div>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 90,
      render: (_: unknown, record: VendorRecord) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEditForm(record)}
            style={{ color: '#f97316' }}
            size="small"
          />
          <Popconfirm
            title="Delete this vendor?"
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
        title="Vendors"
        subtitle={`${vendors.length} vendors`}
        icon={<ShopOutlined />}
        action={
          <Button type="primary" icon={<PlusOutlined />} onClick={openNewForm}>
            Add Vendor
          </Button>
        }
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <Input.Search
          placeholder="Search vendors..."
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
            { value: 'All', label: 'All Categories' },
            { value: 'Electrical', label: 'Electrical' },
            { value: 'Plumbing', label: 'Plumbing' },
            { value: 'Painter', label: 'Painter' },
            { value: 'Extra', label: 'Extra' },
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
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} vendors`,
            size: 'small',
          }}
          locale={{
            emptyText: 'No vendors found. Add your first vendor to get started.',
          }}
          style={{ background: '#fff', borderRadius: 12, minWidth: 700 }}
          size="middle"
          scroll={{ x: 'max-content' }}
        />
      </div>

      <Drawer
        title={editingVendor ? 'Edit Vendor' : 'Add Vendor'}
        placement="right"
        width={dw}
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setEditingVendor(null); form.resetFields(); }}
        extra={
          <Space>
            <Button onClick={() => { setDrawerOpen(false); setEditingVendor(null); form.resetFields(); }}>Cancel</Button>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} onClick={() => form.submit()}>
              {editingVendor ? 'Update Vendor' : 'Save Vendor'}
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ category: 'Electrical', country: 'India' }}
          requiredMark={false}
        >
          <Form.Item label="Vendor name" name="vendorName" rules={[{ required: true, message: 'Please enter vendor name' }]}>
            <Input placeholder="Vendor name" />
          </Form.Item>
          <Form.Item label="GST number" name="gstNumber">
            <Input placeholder="GST number" />
          </Form.Item>
          <Form.Item label="Contact number" name="contactNumber" rules={[{ required: true, message: 'Please enter contact number' }]}>
            <Input placeholder="Primary contact" />
          </Form.Item>
          <Form.Item label="Additional number" name="additionalNumber">
            <Input placeholder="Secondary contact" />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input.TextArea rows={2} placeholder="Vendor address" />
          </Form.Item>
          <Form.Item label="State" name="state">
            <Input placeholder="State" />
          </Form.Item>
          <Form.Item label="Country" name="country">
            <Input placeholder="Country" />
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="Electrical">Electrical</Select.Option>
              <Select.Option value="Plumbing">Plumbing</Select.Option>
              <Select.Option value="Painter">Painter</Select.Option>
              <Select.Option value="Extra">Extra</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
