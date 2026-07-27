'use client';

import { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

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
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f5f5f5]">
      {/* Left: Hero Panel - hidden on mobile */}
      <div className="relative overflow-hidden flex flex-col justify-center bg-[#000435] px-6 py-8 sm:px-10 sm:py-12 lg:px-12 lg:py-16 lg:flex-1 lg:basis-[55%] hidden lg:flex"
        style={{
          background: 'linear-gradient(135deg, #000435 0%, #001a6e 50%, #000435 100%)',
        }}
      >
        {/* Blueprint grid overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
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
        <div className="absolute top-[10%] right-[20%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-[5%] left-[10%] w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] lg:w-[400px] lg:h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />

        {/* Building silhouette - hidden on small screens */}
        <svg className="absolute right-0 bottom-0 w-[60%] opacity-[0.08] pointer-events-none hidden lg:block" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <div className="relative z-10 flex flex-col justify-center flex-1">
          {/* Logo + Brand */}
          <Space size={12} className="mb-6 sm:mb-8 lg:mb-12" style={{}}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-[52px] lg:h-[52px] rounded-[10px] sm:rounded-[12px] lg:rounded-[14px] flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                boxShadow: '0 8px 24px rgba(249,115,22,0.3)',
              }}>
              <svg width="20" height="20" className="sm:w-[22px] sm:h-[22px] lg:w-[26px] lg:h-[26px]" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18" /><path d="M5 21V7l8-4v18" /><path d="M19 21V11l-6-4" /><path d="M9 9v.01" /><path d="M9 12v.01" /><path d="M9 15v.01" /><path d="M9 18v.01" />
              </svg>
            </div>
            <div>
              <Title level={4} className="!text-base sm:!text-lg lg:!text-xl" style={{ color: 'white', margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>4 Square</Title>
              <Text className="text-[10px] sm:text-[11px]" style={{ color: '#fb923c', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Architects & Engineers ERP
              </Text>
            </div>
          </Space>

          <Title level={2} className="!text-xl sm:!text-2xl lg:!text-[36px] max-w-[280px] sm:max-w-[400px] lg:max-w-[480px]" style={{ color: 'white', fontWeight: 700, lineHeight: 1.25, margin: 0 }}>
            Manage your construction projects from{' '}
            <span style={{ color: '#fb923c' }}>blueprint to build</span>
          </Title>
          <Text className="text-[13px] sm:text-[14px] lg:text-[15px] max-w-[280px] sm:max-w-[380px] lg:max-w-[440px] mt-3 sm:mt-4" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
            A complete ERP solution for architects, engineers, and construction firms.
            Track projects, manage teams, control budgets, and monitor progress in real time.
          </Text>

          <Space size={12} className="mt-6 sm:mt-8 lg:mt-10 flex-wrap" style={{}}>
            {features.map((f, i) => (
              <Space key={i} size={6} className="text-[11px] sm:text-[12px] lg:text-[13px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                <span className="text-[13px] sm:text-[14px] lg:text-[16px]" style={{ color: '#fb923c' }}>{f.icon}</span>
                {f.label}
              </Space>
            ))}
          </Space>
        </div>

        <Text className="relative z-10 text-[10px] sm:text-[11px] lg:text-[12px] mt-4 lg:mt-0" style={{ color: 'rgba(255,255,255,0.3)' }}>
          &copy; 2026 4 Square Architects. All rights reserved.
        </Text>
      </div>

      {/* Right: Login Panel */}
      <div className="flex items-center justify-center px-6 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16 lg:flex-[0_0_45%] bg-white">
        <div className="w-full max-w-[400px]">
          {/* Mobile-only branding */}
          {isMobile && <Space size={12} className="mb-6 sm:mb-8 justify-center w-full">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                boxShadow: '0 8px 24px rgba(249,115,22,0.3)',
              }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18" /><path d="M5 21V7l8-4v18" /><path d="M19 21V11l-6-4" /><path d="M9 9v.01" /><path d="M9 12v.01" /><path d="M9 15v.01" /><path d="M9 18v.01" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>4 Square</div>
              <Text style={{ color: '#f97316', fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Architects & Engineers ERP
              </Text>
            </div>
          </Space>
          }

          <div className="mb-6 sm:mb-8">
            <Title level={3} className="!text-lg sm:!text-xl lg:!text-[22px]" style={{ margin: 0, fontWeight: 700 }}>Welcome back</Title>
            <Text type="secondary" className="text-[13px] sm:text-[14px] mt-2 sm:mt-3 block">
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
                className="!h-[44px] sm:!h-[48px] !rounded-[10px] sm:!rounded-[12px]"
              />
            </Form.Item>

            <Form.Item label={<span style={{ fontWeight: 600, fontSize: 13 }}>Password</span>} name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
              <Input.Password
                prefix={<LockOutlined style={{ color: '#999' }} />}
                placeholder="Enter your password"
                size="large"
                className="!h-[44px] sm:!h-[48px] !rounded-[10px] sm:!rounded-[12px]"
                iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              />
            </Form.Item>

            <div className="flex justify-between items-center mb-5 sm:mb-6">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-[13px] sm:text-[14px]">Remember me</Checkbox>
              </Form.Item>
              <Button type="link" className="!p-0 !text-[12px] sm:!text-[13px] !font-medium">
                <Space size={4}>
                  <SafetyCertificateOutlined /> Forgot password?
                </Space>
              </Button>
            </div>

            {error && (
              <Alert message={error} type="error" showIcon className="!rounded-[10px] sm:!rounded-[12px] !mb-4" />
            )}

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              className="!h-[44px] sm:!h-[48px] !rounded-[10px] sm:!rounded-[12px] !font-semibold !text-[14px] sm:!text-[15px]"
              style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                border: 'none', boxShadow: '0 4px 16px rgba(249,115,22,0.3)',
              }}
            >
              <Space><span>Sign In</span><RightOutlined /></Space>
            </Button>
          </Form>

          <Divider className="!my-6 sm:!my-7" />

          <div className="!rounded-[12px] sm:!rounded-[16px] p-4 sm:p-5"
            style={{
              background: '#fff9f0', border: '1px solid #ffedd5',
            }}
          >
            <Space direction="vertical" size={6} style={{ width: '100%' }}>
              <Space>
                <SafetyCertificateOutlined style={{ color: '#f97316', fontSize: 12 }} />
                <Text strong className="!text-[11px] sm:!text-[12px]" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Demo Credentials
                </Text>
              </Space>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div style={{ background: 'white', borderRadius: 10, padding: '10px 14px', border: '1px solid #ffedd5' }}>
                  <Text type="secondary" className="!text-[10px] block">Email</Text>
                  <Text className="!text-[12px] sm:!text-[13px] !font-semibold">admin@4square.com</Text>
                </div>
                <div style={{ background: 'white', borderRadius: 10, padding: '10px 14px', border: '1px solid #ffedd5' }}>
                  <Text type="secondary" className="!text-[10px] block">Password</Text>
                  <Text className="!text-[12px] sm:!text-[13px] !font-semibold">password123</Text>
                </div>
            </div>
          </Space>
          </div>
        </div>
      </div>
    </div>
  );
}
