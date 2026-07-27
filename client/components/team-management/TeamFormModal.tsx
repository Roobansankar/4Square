'use client';

import { Modal, Form, Input, Select, Button, App } from 'antd';
import type { TeamStatus } from '@/types/team';

interface TeamFormModalProps {
  onSave: (data: { name: string; project: string; leader: string; status: TeamStatus }) => void;
  onCancel: () => void;
}

export default function TeamFormModal({ onSave, onCancel }: TeamFormModalProps) {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSave(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Create Team"
      open
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Create Team"
      cancelText="Cancel"
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item name="name" label="Team Name" rules={[{ required: true, message: 'Team name is required' }]}>
          <Input placeholder="e.g. Team D" />
        </Form.Item>
        <Form.Item name="project" label="Project" rules={[{ required: true, message: 'Project is required' }]}>
          <Input placeholder="Assigned project" />
        </Form.Item>
        <Form.Item name="leader" label="Team Leader" rules={[{ required: true, message: 'Team leader is required' }]}>
          <Input placeholder="e.g. Civil Engineer Arun" />
        </Form.Item>
        <Form.Item name="status" label="Status" initialValue="Active">
          <Select>
            <Select.Option value="Active">Active</Select.Option>
            <Select.Option value="Inactive">Inactive</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
