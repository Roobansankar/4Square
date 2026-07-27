'use client';

import { Modal, Form, Input, Select, InputNumber, DatePicker, Button, App } from 'antd';
import dayjs from 'dayjs';
import { STAFF_CATEGORIES, type StaffCategory, type TeamMember } from '@/types/team';

interface MemberFormModalProps {
  initialData?: TeamMember | null;
  initialCategory: StaffCategory;
  lockCategory?: boolean;
  defaultSite: string;
  onSave: (category: StaffCategory, member: TeamMember) => void;
  onCancel: () => void;
}

export default function MemberFormModal({ initialData, initialCategory, lockCategory, defaultSite, onSave, onCancel }: MemberFormModalProps) {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSave(values.category || initialCategory, {
        id: initialData?.id || `mem-${Date.now()}`,
        name: values.name.trim(),
        role: values.role.trim(),
        phone: values.phone.trim(),
        experience: values.experience?.trim() || '—',
        dailyWage: Number(values.dailyWage) || 0,
        joiningDate: values.joiningDate ? dayjs(values.joiningDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        status: values.status || 'Active',
        assignedSite: values.assignedSite?.trim() || defaultSite,
        currentTask: values.currentTask?.trim() || '',
      });
      form.resetFields();
    });
  };

  return (
    <Modal
      title={initialData ? 'Edit Member' : 'Add Member'}
      open
      onOk={handleSubmit}
      onCancel={onCancel}
      okText={initialData ? 'Update Member' : 'Add Member'}
      cancelText="Cancel"
      width={640}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
        initialValues={{
          category: initialCategory,
          name: initialData?.name || '',
          role: initialData?.role || '',
          phone: initialData?.phone || '',
          experience: initialData?.experience || '',
          dailyWage: initialData?.dailyWage || 0,
          joiningDate: initialData?.joiningDate ? dayjs(initialData.joiningDate) : dayjs(),
          status: initialData?.status || 'Active',
          assignedSite: initialData?.assignedSite || defaultSite,
          currentTask: initialData?.currentTask || '',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select disabled={lockCategory || !!initialData}>
              {STAFF_CATEGORIES.map((c) => (
                <Select.Option key={c} value={c}>{c}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Role is required' }]}>
            <Input placeholder="e.g. Mason" />
          </Form.Item>
          <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: 'Phone is required' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="experience" label="Experience">
            <Input placeholder="e.g. 5 years" />
          </Form.Item>
          <Form.Item name="dailyWage" label="Daily Wage (INR)">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="joiningDate" label="Joining Date">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select>
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="On Leave">On Leave</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="assignedSite" label="Assigned Site">
            <Input />
          </Form.Item>
        </div>
        <Form.Item name="currentTask" label="Current Task">
          <Input placeholder="What are they working on right now" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
