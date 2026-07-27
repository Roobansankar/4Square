'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, ConfigProvider, theme } from 'antd';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

const { Content } = Layout;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dark, setDark] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(timer); timer = setTimeout(check, 100); };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); clearTimeout(timer); };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('auth');
      if (!auth) router.replace('/login');
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') {
        setDark(true);
        document.documentElement.classList.add('dark');
      }
    }
  }, [router]);

  const toggleDark = useCallback(() => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }, [dark]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        isMobile={isMobile}
      />
      <Layout style={{ marginLeft: isMobile ? 0 : (collapsed ? 68 : 260), transition: 'margin-left 0.3s' }}>
        <ConfigProvider
          theme={{
            algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: {
              colorPrimary: '#f97316',
              borderRadius: 12,
            },
          }}
        >
          <Navbar
            dark={dark}
            onToggleDark={toggleDark}
            onMenuClick={() => setMobileOpen(true)}
            onToggleCollapse={() => setCollapsed(c => !c)}
            sidebarCollapsed={collapsed}
            isMobile={isMobile}
          />
          <Content style={{
            padding: isMobile ? '16px' : '24px 32px', marginTop: 64,
            background: dark ? '#141414' : '#f5f5f5',
            minHeight: 'calc(100vh - 64px)',
          }}>
            {children}
          </Content>
        </ConfigProvider>
      </Layout>
    </Layout>
  );
}
