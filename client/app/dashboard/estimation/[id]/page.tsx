'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Descriptions, Tag, Space, Typography, Skeleton, Result, Divider, Card } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import type { QuotationRecord } from '../page';

const { Text, Title } = Typography;

const statusColor: Record<string, string> = {
  Draft: 'default',
  Sent: 'blue',
  Approved: 'green',
  Rejected: 'red',
  Pending: 'gold',
};

export default function EstimationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [quote, setQuote] = useState<QuotationRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem('4square-estimations');
      if (stored) {
        const parsed = JSON.parse(stored) as QuotationRecord[];
        const found = parsed.find((q) => q.id === id);
        setQuote(found || null);
      }
    } catch {
      setQuote(null);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    );
  }

  if (!quote) {
    return (
      <Result
        status="404"
        title="Quotation not found"
        subTitle="The quotation you're looking for does not exist."
        extra={<Button type="primary" onClick={() => router.push('/dashboard/estimation')}>Back to Estimations</Button>}
      />
    );
  }

  return (
    <div>
      <Space style={{ marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/dashboard/estimation')}>
          Back
        </Button>
        <Button type="primary" icon={<EditOutlined />} onClick={() => router.push('/dashboard/estimation')}>
          Edit Quotation
        </Button>
      </Space>

      <Card style={{ borderRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>{quote.title}</Title>
            <Text type="secondary" style={{ fontSize: 13 }}>{quote.quoteNo}</Text>
          </div>
          <Tag color={statusColor[quote.status] || 'default'} style={{ fontSize: 13, padding: '4px 12px', borderRadius: 8 }}>
            {quote.status}
          </Tag>
        </div>

        <Divider style={{ margin: '0 0 24px' }} />

        <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }} size="small">
          <Descriptions.Item label="Project" span={2}>{quote.projectName}</Descriptions.Item>
          <Descriptions.Item label="Quote No">{quote.quoteNo}</Descriptions.Item>
          <Descriptions.Item label="Client Name" span={2}>{quote.clientName}</Descriptions.Item>
          <Descriptions.Item label="Total Amount">
            <Text strong style={{ fontSize: 15, color: '#f97316' }}>₹{quote.totalAmount.toLocaleString()}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Email">{quote.clientEmail || '—'}</Descriptions.Item>
          <Descriptions.Item label="Phone 1">{quote.clientPhone1 || '—'}</Descriptions.Item>
          <Descriptions.Item label="Phone 2">{quote.clientPhone2 || '—'}</Descriptions.Item>
          <Descriptions.Item label="Client Address" span={3}>{quote.clientAddress || '—'}</Descriptions.Item>
          <Descriptions.Item label="Quotation Date">{quote.quotationDate || '—'}</Descriptions.Item>
          <Descriptions.Item label="Start Date">{quote.startDate || '—'}</Descriptions.Item>
          <Descriptions.Item label="Valid Till">{quote.validTill || '—'}</Descriptions.Item>
          {quote.notes && (
            <Descriptions.Item label="Notes" span={3}>{quote.notes}</Descriptions.Item>
          )}
        </Descriptions>

        {quote.items && (
          <>
            <Divider style={{ margin: '24px 0' }} />
            <div>
              <Text strong style={{ fontSize: 14 }}>Items / Scope</Text>
              <div style={{ marginTop: 8, padding: 16, background: '#fafafa', borderRadius: 10, whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.7 }}>
                {quote.items}
              </div>
            </div>
          </>
        )}

        <Divider style={{ margin: '24px 0' }} />
        <div style={{ textAlign: 'right' }}>
          <Text type="secondary" style={{ fontSize: 11 }}>
            Created: {new Date(quote.createdAt).toLocaleString()}
          </Text>
        </div>
      </Card>
    </div>
  );
}
