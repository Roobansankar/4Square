'use client';

import { useEffect, useState } from 'react';
import { Form, Input, Select, Button, Space, Typography, Divider } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { TextArea } = Input;

export interface ClientRecord {
  id: string;
  client_code: string;
  client_name: string;
  company_name: string;
  client_type: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gst_number: string;
  status: string;
  remarks: string;
  created_at: string;
  updated_at: string;
}

interface ClientFormProps {
  initialData?: ClientRecord | null;
  onSave: (record: ClientRecord) => void;
  onCancel: () => void;
}

const STORAGE_KEY = '4square-clients';
const clientTypes = ['Individual', 'Company', 'Government', 'Builder', 'Corporate'];
const statusOptions = ['Lead', 'Active', 'Inactive', 'Confirmed'];

function generateClientCode() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `CL-${date}-${Math.floor(Math.random() * 900 + 100)}`;
}

function createEmptyRecord(existing: ClientRecord[]): ClientRecord {
  const existingCodes = existing.map((item) => item.client_code);
  let clientCode = generateClientCode();
  while (existingCodes.includes(clientCode)) {
    clientCode = generateClientCode();
  }

  return {
    id: '',
    client_code: clientCode,
    client_name: '',
    company_name: '',
    client_type: 'Individual',
    mobile: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gst_number: '',
    status: 'Lead',
    remarks: '',
    created_at: new Date().toISOString().slice(0, 10),
    updated_at: new Date().toISOString().slice(0, 10),
  };
}

export default function ClientForm({ initialData, onSave, onCancel }: ClientFormProps) {
  const [form] = Form.useForm();
  const [clientCode, setClientCode] = useState('');

  useEffect(() => {
    if (initialData) {
      setClientCode(initialData.client_code);
      form.setFieldsValue(initialData);
    } else {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const records = stored ? JSON.parse(stored) as ClientRecord[] : [];
      const code = createEmptyRecord(records).client_code;
      setClientCode(code);
      form.setFieldsValue({ client_code: code, status: 'Lead', client_type: 'Individual' });
    }
  }, [initialData, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const payload: ClientRecord = {
        ...values,
        id: initialData?.id || `client-${Date.now()}`,
        client_code: clientCode,
        created_at: initialData?.created_at || new Date().toISOString().slice(0, 10),
        updated_at: new Date().toISOString().slice(0, 10),
      };
      onSave(payload);
      form.resetFields();
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 8 }}>
      <Text strong style={{ fontSize: 14 }}>Client Details</Text>
      <Divider style={{ margin: '8px 0 16px' }} />

      <Form.Item name="client_code" label="Client Code">
        <Input disabled />
      </Form.Item>

      <Form.Item name="client_type" label="Client Type">
        <Select>
          {clientTypes.map((t) => <Select.Option key={t} value={t}>{t}</Select.Option>)}
        </Select>
      </Form.Item>

      <Form.Item name="client_name" label="Client Name" rules={[{ required: true, message: 'Client name is required' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="company_name" label="Company Name">
        <Input />
      </Form.Item>

      <Form.Item name="mobile" label="Mobile" rules={[{ required: true, message: 'Mobile is required' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Invalid email' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="address" label="Address">
        <Input />
      </Form.Item>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
        <Form.Item name="city" label="City">
          <Input />
        </Form.Item>
        <Form.Item name="state" label="State">
          <Input />
        </Form.Item>
        <Form.Item name="pincode" label="Pincode">
          <Input />
        </Form.Item>
        <Form.Item name="gst_number" label="GST Number">
          <Input />
        </Form.Item>
      </div>

      <Form.Item name="status" label="Status">
        <Select>
          {statusOptions.map((s) => <Select.Option key={s} value={s}>{s}</Select.Option>)}
        </Select>
      </Form.Item>

      <Form.Item name="remarks" label="Remarks">
        <TextArea rows={3} />
      </Form.Item>

      <Divider style={{ margin: '12px 0' }} />

      <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
          {initialData ? 'Update Client' : 'Save Client'}
        </Button>
      </Space>
    </Form>
  );
}
