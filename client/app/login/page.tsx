'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Checkbox, Card, Typography, Space, Alert, theme } from 'antd';
import { MailOutlined, LockOutlined, RightOutlined, ApartmentOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const { Title, Text } = Typography;

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
      minHeight: '100vh',
      background: '#000435',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', padding: 16,
    }}>
      {/* Glow orbs */}
      <div style={{ position: 'absolute', top: -160, right: -160, width: 400, height: 400, borderRadius: '50%', background: 'rgba(59,130,246,0.06)', filter: 'blur(100px)' }} />
      <div style={{ position: 'absolute', bottom: -160, left: -160, width: 400, height: 400, borderRadius: '50%', background: 'rgba(59,130,246,0.06)', filter: 'blur(100px)' }} />

      <Card
        style={{
          width: '100%', maxWidth: 420, position: 'relative', zIndex: 1,
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
          borderRadius: 24, border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
        }}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ padding: '24px 40px 16px', textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56, margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(249,115,22,0.25)',
          }}>
            <ApartmentOutlined style={{ fontSize: 28, color: 'white' }} />
          </div>
          <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
            4 Square Architects
          </Title>
          <Text type="secondary" style={{ marginTop: 6, display: 'block' }}>
            Sign in to your account
          </Text>
        </div>

        <div style={{ padding: '0 40px 24px' }}>
          <Form
            onFinish={handleLogin}
            layout="vertical"
            initialValues={{ email: 'admin@4square.com', password: 'password123', remember: false }}
            requiredMark={false}
          >
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email' }]}>
              <Input
                prefix={<MailOutlined />}
                placeholder="Enter your email"
                size="large"
                style={{ borderRadius: 12 }}
              />
            </Form.Item>

            <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                size="large"
                style={{ borderRadius: 12 }}
                iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Button type="link" style={{ padding: 0, fontSize: 12 }}>Forgot?</Button>
              </div>
            </Form.Item>

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
                borderRadius: 12, height: 48, fontWeight: 600,
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                border: 'none',
              }}
            >
              {loading ? 'Signing in...' : <Space><span>Sign In</span><RightOutlined /></Space>}
            </Button>
          </Form>

          <Card
            size="small"
            style={{
              marginTop: 24, borderRadius: 16,
              background: '#fafafa', border: '1px solid #f0f0f0',
            }}
          >
            <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 8 }}>
              Demo Access
            </Text>
            <Space direction="vertical" size={4}>
              <Space size={8}>
                <MailOutlined style={{ fontSize: 12, color: '#999' }} />
                <Text type="secondary" style={{ fontSize: 12 }}>admin@4square.com</Text>
              </Space>
              <Space size={8}>
                <LockOutlined style={{ fontSize: 12, color: '#999' }} />
                <Text type="secondary" style={{ fontSize: 12 }}>password123</Text>
              </Space>
            </Space>
          </Card>
        </div>
      </Card>

      <Text type="secondary" style={{ position: 'absolute', bottom: 24, fontSize: 12 }}>
        &copy; 2024 4 Square Architects. All rights reserved.
      </Text>
    </div>
  );
}
