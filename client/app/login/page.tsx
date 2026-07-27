'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Checkbox, Typography, Space, Alert, Divider } from 'antd';
import {
  MailOutlined, LockOutlined, RightOutlined,
  EyeInvisibleOutlined, EyeTwoTone, SafetyCertificateOutlined,
  DashboardOutlined, TeamOutlined, ToolOutlined, CheckCircleOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const features = [
  { icon: <DashboardOutlined />, label: 'Project Management' },
  { icon: <TeamOutlined />, label: 'Team & HR' },
  { icon: <ToolOutlined />, label: 'Construction Tracking' },
  { icon: <CheckCircleOutlined />, label: 'Quality Control' },
];

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (values: { email: string; password: string; remember: boolean }) => {
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    if (values.email === 'admin@4square.com' && values.password === 'password123') {
      localStorage.setItem('auth', 'true');
      router.push('/dashboard');
    } else {
      setError('Invalid email or password.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: '#f5f5f5',
    }}>
      {/* Left: Hero Panel */}
      <div style={{
        flex: '1 1 55%', display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(135deg, #000435 0%, #001a6e 50%, #000435 100%)',
        position: 'relative', overflow: 'hidden', padding: '60px 48px',
      }}>
        {/* Blueprint grid overlay */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <pattern id="grid-lg" width="160" height="160" patternUnits="userSpaceOnUse">
              <path d="M 160 0 L 0 0 0 160" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#grid-lg)" />
        </svg>

        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '10%', right: '20%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />

        {/* Building silhouette */}
        <svg style={{ position: 'absolute', right: 0, bottom: 0, width: '60%', opacity: 0.08 }} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="40" y="120" width="60" height="280" fill="white" />
          <rect x="50" y="140" width="12" height="16" fill="white" opacity="0.3" />
          <rect x="70" y="140" width="12" height="16" fill="white" opacity="0.3" />
          <rect x="50" y="170" width="12" height="16" fill="white" opacity="0.3" />
          <rect x="70" y="170" width="12" height="16" fill="white" opacity="0.3" />
          <rect x="50" y="200" width="12" height="16" fill="white" opacity="0.3" />
          <rect x="70" y="200" width="12" height="16" fill="white" opacity="0.3" />
          <rect x="120" y="80" width="80" height="320" fill="white" />
          <rect x="132" y="100" width="14" height="18" fill="white" opacity="0.3" />
          <rect x="156" y="100" width="14" height="18" fill="white" opacity="0.3" />
          <rect x="176" y="100" width="14" height="18" fill="white" opacity="0.3" />
          <rect x="132" y="135" width="14" height="18" fill="white" opacity="0.3" />
          <rect x="156" y="135" width="14" height="18" fill="white" opacity="0.3" />
          <rect x="176" y="135" width="14" height="18" fill="white" opacity="0.3" />
          <rect x="132" y="170" width="14" height="18" fill="white" opacity="0.3" />
          <rect x="156" y="170" width="14" height="18" fill="white" opacity="0.3" />
          <rect x="176" y="170" width="14" height="18" fill="white" opacity="0.3" />
          <rect x="240" y="160" width="60" height="240" fill="white" />
          <rect x="250" y="180" width="12" height="14" fill="white" opacity="0.3" />
          <rect x="270" y="180" width="12" height="14" fill="white" opacity="0.3" />
          <rect x="250" y="210" width="12" height="14" fill="white" opacity="0.3" />
          <rect x="270" y="210" width="12" height="14" fill="white" opacity="0.3" />
          <rect x="320" y="200" width="50" height="200" fill="white" />
          <rect x="330" y="220" width="10" height="12" fill="white" opacity="0.3" />
          <rect x="348" y="220" width="10" height="12" fill="white" opacity="0.3" />
        </svg>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
          {/* Logo + Brand */}
          <Space size={16} style={{ marginBottom: 48 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(249,115,22,0.3)',
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18" /><path d="M5 21V7l8-4v18" /><path d="M19 21V11l-6-4" /><path d="M9 9v.01" /><path d="M9 12v.01" /><path d="M9 15v.01" /><path d="M9 18v.01" />
              </svg>
            </div>
            <div>
              <Title level={3} style={{ color: 'white', margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>4 Square</Title>
              <Text style={{ color: '#fb923c', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Architects & Engineers ERP
              </Text>
            </div>
          </Space>

          <Title level={1} style={{ color: 'white', fontSize: 36, fontWeight: 700, lineHeight: 1.25, margin: 0, maxWidth: 480 }}>
            Manage your construction projects from{' '}
            <span style={{ color: '#fb923c' }}>blueprint to build</span>
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginTop: 16, maxWidth: 440, lineHeight: 1.6 }}>
            A complete ERP solution for architects, engineers, and construction firms.
            Track projects, manage teams, control budgets, and monitor progress in real time.
          </Text>

          <Space size={20} style={{ marginTop: 40, flexWrap: 'wrap' }}>
            {features.map((f, i) => (
              <Space key={i} size={8} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                <span style={{ color: '#fb923c', fontSize: 16 }}>{f.icon}</span>
                {f.label}
              </Space>
            ))}
          </Space>
        </div>

        <Text style={{ position: 'relative', zIndex: 1, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
          &copy; 2026 4 Square Architects. All rights reserved.
        </Text>
      </div>

      {/* Right: Login Panel */}
      <div style={{
        flex: '0 0 45%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 48, background: '#fff',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 32 }}>
            <Title level={3} style={{ margin: 0, fontWeight: 700, fontSize: 22 }}>Welcome back</Title>
            <Text type="secondary" style={{ fontSize: 14, marginTop: 8, display: 'block' }}>
              Sign in to your account to continue
            </Text>
          </div>

          <Form
            onFinish={handleLogin}
            layout="vertical"
            initialValues={{ email: 'admin@4square.com', password: 'password123', remember: false }}
            requiredMark={false}
          >
            <Form.Item label={<span style={{ fontWeight: 600, fontSize: 13 }}>Email</span>} name="email" rules={[{ required: true, message: 'Please enter your email' }]}>
              <Input
                prefix={<MailOutlined style={{ color: '#999' }} />}
                placeholder="Enter your email"
                size="large"
                style={{ borderRadius: 12, height: 48 }}
              />
            </Form.Item>

            <Form.Item label={<span style={{ fontWeight: 600, fontSize: 13 }}>Password</span>} name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
              <Input.Password
                prefix={<LockOutlined style={{ color: '#999' }} />}
                placeholder="Enter your password"
                size="large"
                style={{ borderRadius: 12, height: 48 }}
                iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Button type="link" style={{ padding: 0, fontSize: 13, fontWeight: 500 }}>
                <Space size={4}>
                  <SafetyCertificateOutlined /> Forgot password?
                </Space>
              </Button>
            </div>

            {error && (
              <Alert message={error} type="error" showIcon style={{ borderRadius: 12, marginBottom: 16 }} />
            )}

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{
                borderRadius: 12, height: 48, fontWeight: 600, fontSize: 15,
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                border: 'none', boxShadow: '0 4px 16px rgba(249,115,22,0.3)',
              }}
            >
              <Space><span>Sign In</span><RightOutlined /></Space>
            </Button>
          </Form>

          <Divider style={{ margin: '28px 0' }} />

          <div style={{
            background: '#fff9f0', borderRadius: 16, padding: 20,
            border: '1px solid #ffedd5',
          }}>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Space>
                <SafetyCertificateOutlined style={{ color: '#f97316' }} />
                <Text strong style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Demo Credentials
                </Text>
              </Space>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ background: 'white', borderRadius: 10, padding: '10px 14px', border: '1px solid #ffedd5' }}>
                  <Text type="secondary" style={{ fontSize: 10, display: 'block' }}>Email</Text>
                  <Text style={{ fontSize: 13, fontWeight: 600 }}>admin@4square.com</Text>
                </div>
                <div style={{ background: 'white', borderRadius: 10, padding: '10px 14px', border: '1px solid #ffedd5' }}>
                  <Text type="secondary" style={{ fontSize: 10, display: 'block' }}>Password</Text>
                  <Text style={{ fontSize: 13, fontWeight: 600 }}>password123</Text>
                </div>
              </div>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
}
