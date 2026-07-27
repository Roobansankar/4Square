'use client';

import { useRouter } from 'next/navigation';
import { Layout, Space, Input, Badge, Button, Dropdown, Avatar } from 'antd';
import {
  MenuFoldOutlined, MenuUnfoldOutlined, SearchOutlined, BellOutlined, SunOutlined, MoonOutlined, UserOutlined, LogoutOutlined
} from '@ant-design/icons';

const { Header } = Layout;

interface NavbarProps {
  dark: boolean;
  onToggleDark: () => void;
  onMenuClick: () => void;
  onToggleCollapse: () => void;
  sidebarCollapsed: boolean;
}

export default function Navbar({ dark, onToggleDark, onMenuClick, onToggleCollapse, sidebarCollapsed }: NavbarProps) {
  const router = useRouter();

  return (
    <Header style={{
      position: 'fixed', top: 0, right: 0, zIndex: 100,
      height: 64, background: 'var(--card)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px',
      left: sidebarCollapsed ? 68 : 260,
      transition: 'left 0.3s',
    }}>
      <Button
        type="text"
        icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggleCollapse}
        style={{ marginRight: 16, fontSize: 16 }}
      />

      <Input
        placeholder="Search projects, clients..."
        prefix={<SearchOutlined />}
        style={{ maxWidth: 320, borderRadius: 8, background: 'var(--muted)' }}
        className="sm-block"
      />

      <div style={{ flex: 1 }} />

      <Space size="middle">
        <Button type="text" icon={dark ? <SunOutlined /> : <MoonOutlined />} onClick={onToggleDark} />

        <Badge count={0} showZero={false} offset={[-2, 2]}>
          <Button type="text" icon={<BellOutlined />} />
        </Badge>

        <Dropdown menu={{
          onClick: ({ key }) => {
            if (key === 'logout') {
              localStorage.removeItem('auth');
              router.push('/');
            }
          },
          items: [
            { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
            { key: 'settings', icon: <SunOutlined />, label: 'Settings' },
            { type: 'divider' },
            { key: 'logout', icon: <LogoutOutlined />, label: 'Sign out', danger: true },
          ]
        }}>
          <Space style={{ cursor: 'pointer' }}>
            <Avatar size="small" icon={<UserOutlined />} style={{ background: '#f97316' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: dark ? '#fff' : undefined }}>Admin</span>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
}
