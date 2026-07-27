'use client';

import { useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Layout, Menu, type MenuProps } from 'antd';
import {
  DashboardOutlined, FolderOpenOutlined, UserOutlined, ToolOutlined,
  ShoppingCartOutlined, DollarOutlined, TeamOutlined, BarChartOutlined,
  SettingOutlined, FileTextOutlined, EnvironmentOutlined, RiseOutlined,
  ShopOutlined, BankOutlined, WalletOutlined, CreditCardOutlined,
  TransactionOutlined, CalendarOutlined, LockOutlined, PieChartOutlined,
  CopyOutlined, InboxOutlined, ApartmentOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: string,
  key: string,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return { key, icon, label, children } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Dashboard', '/dashboard', <DashboardOutlined />),
  getItem('Projects', 'projects', <FolderOpenOutlined />, [
    getItem('Projects', '/dashboard/projects', <CopyOutlined />),
    getItem('Estimation', '/dashboard/estimation', <FileTextOutlined />),
    getItem('BOQ', '/dashboard/boq', <ApartmentOutlined />),
    getItem('Drawings', '/dashboard/drawings', <EnvironmentOutlined />),
    getItem('Site Progress', '/dashboard/site-progress', <RiseOutlined />),
  ]),
  getItem('Clients', '/dashboard/clients', <UserOutlined />),
  getItem('Construction', 'construction', <ToolOutlined />, [
    getItem('Masonry', '/dashboard/Masonry', <CalendarOutlined />),
    getItem('Centring Work', '/dashboard/centring work', <CalendarOutlined />),
    getItem('Earth Work', '/dashboard/Earth work', <CalendarOutlined />),
    getItem('Painter', '/dashboard/painter', <CalendarOutlined />),
    getItem('Electrical', '/dashboard/electrical', <CalendarOutlined />),
    getItem('Plumber', '/dashboard/plumber', <CalendarOutlined />),
    getItem('Tile Laying', '/dashboard/Tile laying', <CalendarOutlined />),
    getItem('Fabricator', '/dashboard/Fabricator', <CalendarOutlined />),
    getItem('Water Proofing', '/dashboard/Water proofing', <CalendarOutlined />),
    getItem('Automation', '/dashboard/Automation', <CalendarOutlined />),
    getItem('Glass', '/dashboard/Glass', <CalendarOutlined />),
    getItem('Landscape', '/dashboard/Landscape', <CalendarOutlined />),
    getItem('Carpenter', '/dashboard/Carpenter', <CalendarOutlined />),
  ]),
  getItem('Purchase', 'purchase', <ShoppingCartOutlined />, [
    getItem('Vendors', '/dashboard/vendors', <BankOutlined />),
    getItem('Materials', '/dashboard/materials', <InboxOutlined />),
    getItem('Purchase Orders', '/dashboard/purchase-orders', <ShopOutlined />),
    getItem('Inventory', '/dashboard/inventory', <ApartmentOutlined />),
  ]),
  getItem('Accounts', 'accounts', <DollarOutlined />, [
    getItem('Bills', '/dashboard/bills', <FileTextOutlined />),
    getItem('Payments', '/dashboard/payments', <CreditCardOutlined />),
    getItem('Expenses', '/dashboard/expenses', <WalletOutlined />),
    getItem('Cash Flow', '/dashboard/cashflow', <TransactionOutlined />),
  ]),
  getItem('HR', 'hr', <TeamOutlined />, [
    getItem('Team Management', '/dashboard/team-management', <ApartmentOutlined />),
    getItem('Staff', '/dashboard/staff', <UserOutlined />),
    getItem('Salary', '/dashboard/salary', <CreditCardOutlined />),
    getItem('Leave', '/dashboard/leave', <CalendarOutlined />),
    getItem('Roles & Permissions', '/dashboard/roles', <LockOutlined />),
  ]),
  getItem('Reports', 'reports', <BarChartOutlined />, [
    getItem('Project Reports', '/dashboard/reports', <PieChartOutlined />),
    getItem('Expense Reports', '/dashboard/expense-reports', <FileTextOutlined />),
    getItem('Profit & Loss', '/dashboard/profit-loss', <RiseOutlined />),
    getItem('Daily Reports', '/dashboard/daily-reports', <CopyOutlined />),
  ]),
  getItem('Settings', '/dashboard/settings', <SettingOutlined />),
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const selectedKeys = useMemo(() => [pathname], [pathname]);
  const defaultOpenKeys = useMemo(() => {
    const groups = ['projects', 'construction', 'purchase', 'accounts', 'hr', 'reports'];
    const found = groups.find(g => pathname.startsWith('/dashboard'));
    return found ? [found] : [];
  }, [pathname]);

  const onClick = ({ key }: { key: string }) => {
    if (key.startsWith('/')) {
      router.push(key);
      if (onMobileClose) onMobileClose();
    }
  };

  return (
    <>
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 998 }}
          onClick={onMobileClose}
        />
      )}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onToggle}
        width={260}
        collapsedWidth={68}
        trigger={null}
        theme="dark"
        style={{
          background: 'var(--sidebar-bg)',
          overflow: 'auto',
          height: '100vh',
          position: 'sticky',
          top: 0,
          left: 0,
          borderRight: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          {/* Logo */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 12, padding: '20px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden', flexShrink: 0,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <ApartmentOutlined style={{ color: 'white', fontSize: 20 }} />
            </div>
            {!collapsed && (
              <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'white', lineHeight: 1.2 }}>4 Square</div>
                <div style={{ fontSize: 11, color: '#fb923c', fontWeight: 500, letterSpacing: '0.05em' }}>ARCHITECTS ERP</div>
              </div>
            )}
          </div>

          {/* Menu */}
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            <Menu
              mode="inline"
              selectedKeys={selectedKeys}
              defaultOpenKeys={defaultOpenKeys}
              items={items}
              onClick={onClick}
              inlineIndent={16}
              style={{ background: 'transparent', borderInlineEnd: 'none', padding: '8px 4px' }}
              theme="dark"
            />
          </div>
        </div>
      </Sider>
    </>
  );
}
