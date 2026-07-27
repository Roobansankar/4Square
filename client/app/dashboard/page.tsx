'use client';

import { Card, Row, Col, Statistic, Table, Tag, Progress, Typography, Space, List, Button, Divider } from 'antd';
import {
  FolderOpenOutlined, UserOutlined, CheckCircleOutlined, TeamOutlined,
  ToolOutlined, ClockCircleOutlined, BellOutlined, CalendarOutlined,
  ArrowUpOutlined, ArrowDownOutlined
} from '@ant-design/icons';
import { ProjectStatusChart, MonthlyExpensesChart } from '@/components/Charts';
import projectsData from '@/data/projects.json';
import attendanceData from '@/data/attendance.json';
import { formatCurrency, formatDate } from '@/lib/helpers';

const { Text, Title } = Typography;

const recentActivities = [
  { icon: <FolderOpenOutlined />, text: 'New project "Smart Office Complex" created', time: '2 min ago' },
  { icon: <ToolOutlined />, text: 'Raj Constructions assigned to Skyline Tower', time: '1 hr ago' },
  { icon: <BellOutlined />, text: 'Steel order ₹2.5L placed with CBE Steel Corp', time: '3 hr ago' },
  { icon: <CheckCircleOutlined />, text: 'Site inspection completed at Heritage Hotel', time: '5 hr ago' },
  { icon: <TeamOutlined />, text: 'Client meeting with Infosys Realty scheduled', time: 'Yesterday' },
];

const upcomingMeetings = [
  { title: 'Infosys Realty Review', date: 'Jul 12, 2024', time: '11:00 AM', client: 'Infosys Realty' },
  { title: 'Metro Hub Site Walk', date: 'Jul 14, 2024', time: '9:30 AM', client: 'TechSpace Ltd' },
  { title: 'Skyline Progress Review', date: 'Jul 15, 2024', time: '3:00 PM', client: 'Ramesh Kumar' },
];

const pendingApprovals = [
  { id: 'PAY-004', desc: 'Electra Cables Ltd Invoice', amount: 180000, type: 'Payment' },
  { id: 'PO-005', desc: 'Asian Paints Purchase Order', amount: 43000, type: 'PO' },
  { id: 'EXP-007', desc: 'Equipment Rental – Metro Hub', amount: 25000, type: 'Expense' },
];

const projectColumns = [
  { title: 'Project', dataIndex: 'name', key: 'name', width: 180,
    render: (name: string, record: { location: string }) => (
      <div><Text strong style={{ fontSize: 13 }}>{name}</Text><br /><Text type="secondary" style={{ fontSize: 11 }}>{record.location}</Text></div>
    ),
  },
  { title: 'Client', dataIndex: 'client', key: 'client', width: 120 },
  { title: 'Status', dataIndex: 'status', key: 'status', width: 100,
    render: (status: string) => <Tag color={status === 'Active' ? 'processing' : status === 'Completed' ? 'success' : 'default'}>{status}</Tag>,
  },
  { title: 'Progress', dataIndex: 'completion', key: 'completion', width: 140,
    render: (completion: number) => (
      <Space size={8}>
        <Progress percent={completion} size="small" showInfo={false} style={{ width: 70, margin: 0 }} strokeColor="#f97316" railColor="#f0f0f0" />
        <Text style={{ fontSize: 12, color: '#888' }}>{completion}%</Text>
      </Space>
    ),
  },
];

export default function DashboardPage() {
  const activeProjects = projectsData.filter(p => p.status === 'Active').length;
  const completedProjects = projectsData.filter(p => p.status === 'Completed').length;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>Dashboard</Title>
        <Text type="secondary" style={{ fontSize: 13 }}>Welcome back, Admin</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={12} sm={12} md={6} xl={4} style={{ display: 'flex' }}>
          <Card size="small" styles={{ body: { padding: '16px 20px', flex: 1 } }} style={{ flex: 1 }}>
            <Statistic title="Total Projects" value={28} prefix={<FolderOpenOutlined style={{ color: '#f97316', marginRight: 6 }} />} />
            <div style={{ marginTop: 6, fontSize: 11, color: '#52c41a' }}><ArrowUpOutlined /> +2 this month</div>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6} xl={4} style={{ display: 'flex' }}>
          <Card size="small" styles={{ body: { padding: '16px 20px', flex: 1 } }} style={{ flex: 1 }}>
            <Statistic title="Active Projects" value={activeProjects} prefix={<ToolOutlined style={{ color: '#f97316', marginRight: 6 }} />} />
            <div style={{ marginTop: 6, fontSize: 11, color: '#faad14' }}><ClockCircleOutlined /> 3 nearing deadline</div>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6} xl={4} style={{ display: 'flex' }}>
          <Card size="small" styles={{ body: { padding: '16px 20px', flex: 1 } }} style={{ flex: 1 }}>
            <Statistic title="Completed" value={completedProjects} prefix={<CheckCircleOutlined style={{ color: '#52c41a', marginRight: 6 }} />} />
            <div style={{ marginTop: 6, fontSize: 11, color: '#52c41a' }}><ArrowUpOutlined /> +1 this month</div>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6} xl={4} style={{ display: 'flex' }}>
          <Card size="small" styles={{ body: { padding: '16px 20px', flex: 1 } }} style={{ flex: 1 }}>
            <Statistic title="Total Clients" value={54} prefix={<TeamOutlined style={{ color: '#1677ff', marginRight: 6 }} />} />
            <div style={{ marginTop: 6, fontSize: 11, color: '#52c41a' }}><ArrowUpOutlined /> +4 new</div>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6} xl={4} style={{ display: 'flex' }}>
          <Card size="small" styles={{ body: { padding: '16px 20px', flex: 1 } }} style={{ flex: 1 }}>
            <Statistic title="Engineers" value={16} prefix={<UserOutlined style={{ color: '#722ed1', marginRight: 6 }} />} />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6} xl={4} style={{ display: 'flex' }}>
          <Card size="small" styles={{ body: { padding: '16px 20px', flex: 1 } }} style={{ flex: 1 }}>
            <Statistic title="Pending Bills" value="₹8,50,000" prefix={<BellOutlined style={{ color: '#ff4d4f', marginRight: 6 }} />} />
            <div style={{ marginTop: 6, fontSize: 11, color: '#ff4d4f' }}><ArrowDownOutlined /> 5 overdue</div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="Project Status Overview" size="small" styles={{ body: { padding: '12px 20px' } }}>
            <ProjectStatusChart />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Monthly Revenue vs Expenses" size="small" styles={{ body: { padding: '12px 20px' } }}>
            <MonthlyExpensesChart />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card
            title="Active Projects"
            size="small"
            extra={<Button type="link" href="/dashboard/projects" style={{ fontSize: 12 }}>View all</Button>}
            styles={{ body: { padding: 0 } }}
          >
            <Table
              dataSource={projectsData.filter(p => p.status === 'Active').slice(0, 5)}
              columns={projectColumns}
              rowKey="id"
              pagination={false}
              size="small"
              showHeader={false}
              style={{ border: 'none' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card
              title={<Space><BellOutlined style={{ color: '#f97316' }} /> Pending Approvals</Space>}
              size="small"
              styles={{ body: { padding: '12px 20px' } }}
            >
              <List
                dataSource={pendingApprovals}
                split={false}
                size="small"
                renderItem={(item) => (
                  <List.Item style={{ padding: '8px 0' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Text style={{ fontSize: 13, display: 'block' }} ellipsis>{item.desc}</Text>
                      <Text type="secondary" style={{ fontSize: 11 }}>{item.id} · {item.type}</Text>
                    </div>
                    <div style={{ textAlign: 'right', marginLeft: 12 }}>
                      <Text strong style={{ fontSize: 13, color: '#f97316', whiteSpace: 'nowrap' }}>{formatCurrency(item.amount)}</Text>
                      <br />
                      <Button type="link" size="small" style={{ fontSize: 11, padding: 0 }}>Approve</Button>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            <Card
              title={<Space><ClockCircleOutlined style={{ color: '#f97316' }} /> Recent Activity</Space>}
              size="small"
              styles={{ body: { padding: '12px 20px' } }}
            >
              <List
                dataSource={recentActivities}
                split={false}
                size="small"
                renderItem={(item) => (
                  <List.Item style={{ padding: '6px 0', gap: 10 }}>
                    <span style={{ color: '#f97316', fontSize: 14 }}>{item.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Text style={{ fontSize: 12 }}>{item.text}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 10 }}>{item.time}</Text>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </Col>
      </Row>

      <Card
        title={<Space><CalendarOutlined style={{ color: '#f97316' }} /> Upcoming Meetings</Space>}
        size="small"
        extra={<Button type="link" style={{ fontSize: 12 }}>View calendar</Button>}
        style={{ marginTop: 16 }}
        styles={{ body: { padding: '16px 20px' } }}
      >
        <Row gutter={[16, 16]}>
          {upcomingMeetings.map((m, i) => (
            <Col xs={24} sm={8} key={i}>
              <Card size="small" styles={{ body: { padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' } }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, background: '#f97316', color: '#fff',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, lineHeight: 1.2, flexShrink: 0,
                }}>
                  <span>{m.date.split(' ')[1].replace(',', '')}</span>
                  <span>{m.date.split(' ')[0]}</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <Text strong style={{ fontSize: 13, display: 'block' }}>{m.title}</Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>{m.client}</Text>
                  <br />
                  <Text style={{ fontSize: 11, color: '#f97316' }}>{m.time}</Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
}
