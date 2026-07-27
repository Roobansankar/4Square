'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Table, Button, Tag, Input, Select, Drawer, Modal, DatePicker, InputNumber, Space, Typography, Popconfirm, message, Tabs, Descriptions, Divider, Form } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, CopyOutlined, CheckCircleOutlined, DownloadOutlined, FolderOpenOutlined, PrinterOutlined } from '@ant-design/icons';
import PageHeader from '@/components/PageHeader';

const { Text } = Typography;
const { TextArea } = Input;

interface BoqItem {
  id: string;
  itemCode: string;
  itemName: string;
  description: string;
  category: string;
  subCategory: string;
  unit: string;
  length: number;
  width: number;
  height: number;
  thickness: number;
  quantity: number;
  rate: number;
  discount: number;
  gst: number;
  amount: number;
  remarks: string;
}

interface BoqMaterial {
  id: string;
  materialName: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  wastePercentage: number;
  supplier: string;
}

interface BoqLabour {
  id: string;
  labourType: string;
  noOfWorkers: number;
  workingDays: number;
  ratePerDay: number;
  totalAmount: number;
}

interface BoqEquipment {
  id: string;
  equipmentName: string;
  hours: number;
  rate: number;
  amount: number;
}

interface BoqAttachment {
  id: string;
  name: string;
  type: string;
}

interface BoqRevision {
  id: string;
  revisionNumber: string;
  version: string;
  status: string;
  updatedAt: string;
  note: string;
}

interface BoqSummary {
  materialCost: number;
  labourCost: number;
  equipmentCost: number;
  transportationCost: number;
  subContractorCost: number;
  miscellaneous: number;
  discount: number;
  gst: number;
  grandTotal: number;
}

interface BoqRecord {
  id: string;
  boqNumber: string;
  project: string;
  client: string;
  projectType: string;
  boqName: string;
  revisionNumber: string;
  version: string;
  boqDate: string;
  preparedBy: string;
  checkedBy: string;
  approvedBy: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Revision' | 'Rejected';
  remarks: string;
  workCategory: string;
  items: BoqItem[];
  materials: BoqMaterial[];
  labours: BoqLabour[];
  equipments: BoqEquipment[];
  attachments: BoqAttachment[];
  revisions: BoqRevision[];
  summary: BoqSummary;
  createdAt: string;
  updatedAt: string;
}

interface BoqFormState {
  id: string;
  boqNumber: string;
  project: string;
  client: string;
  projectType: string;
  boqName: string;
  revisionNumber: string;
  version: string;
  boqDate: string;
  preparedBy: string;
  checkedBy: string;
  approvedBy: string;
  status: BoqRecord['status'];
  remarks: string;
  workCategory: string;
  items: BoqItem[];
  materials: BoqMaterial[];
  labours: BoqLabour[];
  equipments: BoqEquipment[];
  attachments: BoqAttachment[];
  revisions: BoqRevision[];
  summary: BoqSummary;
}

const STORAGE_KEY = '4square-boqs';

const workCategories = [
  'Site Preparation', 'Earth Work', 'Foundation', 'RCC Work', 'Brick Work',
  'Roof Work', 'Plastering', 'Flooring', 'Electrical', 'Plumbing', 'Painting',
  'False Ceiling', 'Doors', 'Windows', 'Fabrication', 'Waterproofing', 'HVAC',
  'Landscape', 'External Development',
];

const unitOptions = ['Nos', 'Sq.ft', 'Sq.m', 'Running Feet', 'Meter', 'Kg', 'Ton', 'Bag', 'Litre', 'Cum', 'Cft'];
const statusOptions = ['Draft', 'Submitted', 'Approved', 'Revision', 'Rejected'] as const;

function createEmptyItem(): BoqItem {
  return { id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, itemCode: '', itemName: '', description: '', category: '', subCategory: '', unit: 'Nos', length: 0, width: 0, height: 0, thickness: 0, quantity: 1, rate: 0, discount: 0, gst: 0, amount: 0, remarks: '' };
}

function createEmptyMaterial(): BoqMaterial {
  return { id: `mat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, materialName: '', quantity: 1, unit: 'Nos', rate: 0, amount: 0, wastePercentage: 0, supplier: '' };
}

function createEmptyLabour(): BoqLabour {
  return { id: `lab-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, labourType: '', noOfWorkers: 1, workingDays: 1, ratePerDay: 0, totalAmount: 0 };
}

function createEmptyEquipment(): BoqEquipment {
  return { id: `eqp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, equipmentName: '', hours: 1, rate: 0, amount: 0 };
}

function createEmptyAttachment(): BoqAttachment {
  return { id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name: '', type: 'Supporting Document' };
}

function generateBoqNumber(existing: BoqRecord[]) {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const todayCount = existing.filter((item) => item.boqNumber.includes(datePart)).length + 1;
  return `BOQ-${datePart}-${String(todayCount).padStart(3, '0')}`;
}

function createEmptyForm(existing: BoqRecord[]): BoqFormState {
  return {
    id: '', boqNumber: generateBoqNumber(existing), project: '', client: '', projectType: 'Residential',
    boqName: '', revisionNumber: 'R0', version: 'V1', boqDate: new Date().toISOString().slice(0, 10),
    preparedBy: '', checkedBy: '', approvedBy: '', status: 'Draft', remarks: '', workCategory: 'Site Preparation',
    items: [createEmptyItem()], materials: [createEmptyMaterial()], labours: [createEmptyLabour()],
    equipments: [createEmptyEquipment()], attachments: [createEmptyAttachment()], revisions: [],
    summary: { materialCost: 0, labourCost: 0, equipmentCost: 0, transportationCost: 0, subContractorCost: 0, miscellaneous: 0, discount: 0, gst: 0, grandTotal: 0 },
  };
}

function calculateItemAmount(item: BoqItem) {
  const base = (item.quantity || 0) * (item.rate || 0);
  const afterDiscount = base - (base * ((item.discount || 0) / 100));
  return afterDiscount * (1 + (item.gst || 0) / 100);
}

function calculateSummary(data: BoqFormState): BoqSummary {
  const materialCost = data.materials.reduce((sum, row) => sum + (row.amount || 0), 0);
  const labourCost = data.labours.reduce((sum, row) => sum + (row.totalAmount || 0), 0);
  const equipmentCost = data.equipments.reduce((sum, row) => sum + (row.amount || 0), 0);
  const transportationCost = data.summary.transportationCost || 0;
  const subContractorCost = data.summary.subContractorCost || 0;
  const miscellaneous = data.summary.miscellaneous || 0;
  const subtotal = materialCost + labourCost + equipmentCost + transportationCost + subContractorCost + miscellaneous;
  const discountAmount = subtotal * ((data.summary.discount || 0) / 100);
  const gstAmount = (subtotal - discountAmount) * ((data.summary.gst || 0) / 100);
  const grandTotal = subtotal - discountAmount + gstAmount;
  return { materialCost, labourCost, equipmentCost, transportationCost, subContractorCost, miscellaneous, discount: discountAmount, gst: gstAmount, grandTotal };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);
}

function buildPdf(boq: BoqRecord) {
  const lines = [
    'BOQ Report', `BOQ No: ${boq.boqNumber}`, `Project: ${boq.project}`, `Client: ${boq.client}`,
    `BOQ Name: ${boq.boqName}`, `Status: ${boq.status}`, 'Items:',
    ...boq.items.map((item) => `- ${item.itemName || item.itemCode} | Qty: ${item.quantity} | Amount: ${formatCurrency(item.amount)}`),
    'Summary:', `Grand Total: ${formatCurrency(boq.summary.grandTotal)}`,
  ];
  const content = lines.join('\n');
  const stream = `BT /F1 12 Tf 50 760 Td (${content.replace(/\(/g, '\\(').replace(/\)/g, '\\)')}) Tj ET`;
  const streamLength = stream.length;
  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj',
    `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${stream}\nendstream\nendobj`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
  ];
  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  objects.forEach((object) => { offsets.push(pdf.length); pdf += object + '\n'; });
  const xrefOffset = pdf.length;
  pdf += 'xref\n' + `0 ${objects.length + 1}\n` + '0000000000 65535 f \n';
  offsets.forEach((offset) => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n`; });
  pdf += 'trailer\n' + `<< /Size ${objects.length + 1} /Root 1 0 R >>\n` + `startxref\n${xrefOffset}\n%%EOF`;
  return new Blob([pdf], { type: 'application/pdf' });
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = filename; link.click();
  window.URL.revokeObjectURL(url);
}

const statusColor: Record<string, string> = {
  Draft: 'default', Submitted: 'blue', Approved: 'green', Revision: 'gold', Rejected: 'red',
};

export default function Page() {
  const [boqs, setBoqs] = useState<BoqRecord[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BoqFormState>(() => createEmptyForm([]));
  const [activeTab, setActiveTab] = useState('header');

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedBoq, setSelectedBoq] = useState<BoqRecord | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBoqs(JSON.parse(stored) as BoqRecord[]);
      } else {
        const sample: BoqRecord[] = [{
          id: 'boq-sample-1', boqNumber: 'BOQ-20260716-001', project: 'Skyline Villa', client: 'Aarav Group',
          projectType: 'Residential', boqName: 'Foundation and Super Structure', revisionNumber: 'R0', version: 'V1',
          boqDate: '2026-07-16', preparedBy: 'Ravi', checkedBy: 'Naveen', approvedBy: 'Shyam', status: 'Approved',
          remarks: 'Approved for execution', workCategory: 'Foundation',
          items: [{ id: 'sample-item-1', itemCode: 'FW-001', itemName: 'Footing Concrete', description: 'M25 grade footing concrete', category: 'Foundation', subCategory: 'Concrete', unit: 'Cum', length: 0, width: 0, height: 0, thickness: 0, quantity: 20, rate: 8500, discount: 0, gst: 18, amount: 200600, remarks: 'Ready mix' }],
          materials: [{ id: 'sample-material-1', materialName: 'Cement', quantity: 200, unit: 'Bag', rate: 450, amount: 90000, wastePercentage: 5, supplier: 'Delta Cement' }],
          labours: [{ id: 'sample-labour-1', labourType: 'Mason', noOfWorkers: 4, workingDays: 3, ratePerDay: 1200, totalAmount: 14400 }],
          equipments: [{ id: 'sample-equipment-1', equipmentName: 'Mixer', hours: 8, rate: 450, amount: 3600 }],
          attachments: [{ id: 'sample-attachment-1', name: 'drawing-01.pdf', type: 'Drawing' }],
          revisions: [{ id: 'sample-revision-1', revisionNumber: 'R0', version: 'V1', status: 'Approved', updatedAt: '2026-07-16', note: 'Initial approval' }],
          summary: { materialCost: 90000, labourCost: 14400, equipmentCost: 3600, transportationCost: 5000, subContractorCost: 15000, miscellaneous: 2000, discount: 0, gst: 0, grandTotal: 126000 },
          createdAt: '2026-07-16', updatedAt: '2026-07-16',
        }];
        setBoqs(sample);
      }
    } catch { setBoqs([]); }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(boqs));
  }, [boqs]);

  const filteredBoqs = useMemo(() => {
    const query = search.toLowerCase();
    return boqs.filter((boq) => {
      const matchesSearch = !query || [boq.boqNumber, boq.project, boq.client, boq.boqName].some((field) => field.toLowerCase().includes(query));
      const matchesStatus = !statusFilter || boq.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [boqs, search, statusFilter]);

  const openNewForm = () => {
    setEditingId(null);
    setFormData(createEmptyForm(boqs));
    setActiveTab('header');
    setEditorOpen(true);
  };

  const openEditForm = (boq: BoqRecord) => {
    setEditingId(boq.id);
    setFormData({
      ...boq,
      items: boq.items.length ? boq.items : [createEmptyItem()],
      materials: boq.materials.length ? boq.materials : [createEmptyMaterial()],
      labours: boq.labours.length ? boq.labours : [createEmptyLabour()],
      equipments: boq.equipments.length ? boq.equipments : [createEmptyEquipment()],
      attachments: boq.attachments.length ? boq.attachments : [createEmptyAttachment()],
      revisions: boq.revisions || [],
    });
    setActiveTab('header');
    setEditorOpen(true);
  };

  const openView = (boq: BoqRecord) => {
    setSelectedBoq(boq);
    setViewModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setBoqs((prev) => prev.filter((boq) => boq.id !== id));
    message.success('BOQ deleted');
  };

  const handleDuplicate = (boq: BoqRecord) => {
    const duplicated: BoqRecord = {
      ...boq, id: `boq-${Date.now()}`, boqNumber: generateBoqNumber(boqs),
      boqName: `${boq.boqName} (Copy)`, status: 'Draft',
      revisions: [{ id: `rev-${Date.now()}`, revisionNumber: 'R0', version: 'V1', status: 'Draft', updatedAt: new Date().toISOString().slice(0, 10), note: 'Duplicated from existing BOQ' }],
      createdAt: new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString().slice(0, 10),
    };
    setBoqs((prev) => [duplicated, ...prev]);
    message.success('BOQ duplicated');
  };

  const handleApprove = (id: string) => {
    setBoqs((prev) => prev.map((boq) => {
      if (boq.id !== id) return boq;
      const revision: BoqRevision = { id: `rev-${Date.now()}`, revisionNumber: boq.revisionNumber, version: boq.version, status: 'Approved', updatedAt: new Date().toISOString().slice(0, 10), note: 'Approved by user' };
      return { ...boq, status: 'Approved', revisions: [...boq.revisions, revision], updatedAt: new Date().toISOString().slice(0, 10) };
    }));
    message.success('BOQ approved');
  };

  const updateForm = (field: keyof BoqFormState, value: string | number | BoqSummary | BoqItem[] | BoqMaterial[] | BoqLabour[] | BoqEquipment[] | BoqAttachment[] | BoqRevision[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (index: number, field: keyof BoqItem, value: string | number) => {
    const nextItems = [...formData.items];
    nextItems[index] = { ...nextItems[index], [field]: value } as BoqItem;
    nextItems[index].amount = calculateItemAmount(nextItems[index]);
    setFormData((prev) => ({ ...prev, items: nextItems }));
  };

  const updateMaterial = (index: number, field: keyof BoqMaterial, value: string | number) => {
    const nextMaterials = [...formData.materials];
    nextMaterials[index] = { ...nextMaterials[index], [field]: value } as BoqMaterial;
    nextMaterials[index].amount = (nextMaterials[index].quantity || 0) * (nextMaterials[index].rate || 0);
    setFormData((prev) => ({ ...prev, materials: nextMaterials }));
  };

  const updateLabour = (index: number, field: keyof BoqLabour, value: string | number) => {
    const nextLabours = [...formData.labours];
    nextLabours[index] = { ...nextLabours[index], [field]: value } as BoqLabour;
    nextLabours[index].totalAmount = (nextLabours[index].noOfWorkers || 0) * (nextLabours[index].workingDays || 0) * (nextLabours[index].ratePerDay || 0);
    setFormData((prev) => ({ ...prev, labours: nextLabours }));
  };

  const updateEquipment = (index: number, field: keyof BoqEquipment, value: string | number) => {
    const nextEquipments = [...formData.equipments];
    nextEquipments[index] = { ...nextEquipments[index], [field]: value } as BoqEquipment;
    nextEquipments[index].amount = (nextEquipments[index].hours || 0) * (nextEquipments[index].rate || 0);
    setFormData((prev) => ({ ...prev, equipments: nextEquipments }));
  };

  const updateAttachment = (index: number, field: keyof BoqAttachment, value: string) => {
    const nextAttachments = [...formData.attachments];
    nextAttachments[index] = { ...nextAttachments[index], [field]: value } as BoqAttachment;
    setFormData((prev) => ({ ...prev, attachments: nextAttachments }));
  };

  const addRow = (section: 'items' | 'materials' | 'labours' | 'equipments' | 'attachments') => {
    if (section === 'items') setFormData((prev) => ({ ...prev, items: [...prev.items, createEmptyItem()] }));
    if (section === 'materials') setFormData((prev) => ({ ...prev, materials: [...prev.materials, createEmptyMaterial()] }));
    if (section === 'labours') setFormData((prev) => ({ ...prev, labours: [...prev.labours, createEmptyLabour()] }));
    if (section === 'equipments') setFormData((prev) => ({ ...prev, equipments: [...prev.equipments, createEmptyEquipment()] }));
    if (section === 'attachments') setFormData((prev) => ({ ...prev, attachments: [...prev.attachments, createEmptyAttachment()] }));
  };

  const removeRow = (section: 'items' | 'materials' | 'labours' | 'equipments' | 'attachments', index: number) => {
    if (section === 'items' && formData.items.length > 1) setFormData((prev) => ({ ...prev, items: prev.items.filter((_, idx) => idx !== index) }));
    if (section === 'materials' && formData.materials.length > 1) setFormData((prev) => ({ ...prev, materials: prev.materials.filter((_, idx) => idx !== index) }));
    if (section === 'labours' && formData.labours.length > 1) setFormData((prev) => ({ ...prev, labours: prev.labours.filter((_, idx) => idx !== index) }));
    if (section === 'equipments' && formData.equipments.length > 1) setFormData((prev) => ({ ...prev, equipments: prev.equipments.filter((_, idx) => idx !== index) }));
    if (section === 'attachments' && formData.attachments.length > 1) setFormData((prev) => ({ ...prev, attachments: prev.attachments.filter((_, idx) => idx !== index) }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.project.trim() || !formData.boqName.trim()) { message.error('Project and BOQ name are required'); return; }
    if (formData.items.length < 1) { message.error('At least one BOQ item is required'); return; }
    const invalidItem = formData.items.find((item) => item.quantity <= 0 || item.rate <= 0);
    if (invalidItem) { message.error('Each BOQ item must have quantity and rate greater than zero'); return; }

    const summary = calculateSummary(formData);
    const timestamp = new Date().toISOString().slice(0, 10);
    const payload: BoqRecord = {
      id: editingId || `boq-${Date.now()}`,
      boqNumber: formData.boqNumber || generateBoqNumber(boqs),
      project: formData.project.trim(), client: formData.client.trim(),
      projectType: formData.projectType, boqName: formData.boqName.trim(),
      revisionNumber: formData.revisionNumber, version: formData.version,
      boqDate: formData.boqDate, preparedBy: formData.preparedBy.trim(),
      checkedBy: formData.checkedBy.trim(), approvedBy: formData.approvedBy.trim(),
      status: formData.status, remarks: formData.remarks.trim(), workCategory: formData.workCategory,
      items: formData.items.map((item) => ({ ...item, amount: calculateItemAmount(item) })),
      materials: formData.materials.map((m) => ({ ...m, amount: (m.quantity || 0) * (m.rate || 0) })),
      labours: formData.labours.map((l) => ({ ...l, totalAmount: (l.noOfWorkers || 0) * (l.workingDays || 0) * (l.ratePerDay || 0) })),
      equipments: formData.equipments.map((e) => ({ ...e, amount: (e.hours || 0) * (e.rate || 0) })),
      attachments: formData.attachments.map((a) => ({ ...a })),
      revisions: editingId ? formData.revisions : [{ id: `rev-${Date.now()}`, revisionNumber: formData.revisionNumber, version: formData.version, status: formData.status, updatedAt: timestamp, note: 'Initial BOQ created' }],
      summary, createdAt: editingId ? boqs.find((b) => b.id === editingId)?.createdAt || timestamp : timestamp, updatedAt: timestamp,
    };

    if (editingId) {
      setBoqs((prev) => prev.map((boq) => (boq.id === editingId ? payload : boq)));
    } else {
      setBoqs((prev) => [payload, ...prev]);
    }
    setEditorOpen(false);
    setEditingId(null);
    setFormData(createEmptyForm(boqs));
    message.success(`BOQ ${editingId ? 'updated' : 'created'}`);
  };

  const exportPdf = (boq: BoqRecord) => {
    const blob = buildPdf(boq);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `${boq.boqNumber}.pdf`; link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportExcel = (boq: BoqRecord) => {
    const rows = [
      ['BOQ Number', boq.boqNumber], ['Project', boq.project], ['Client', boq.client],
      ['BOQ Name', boq.boqName], ['Status', boq.status], ['Grand Total', boq.summary.grandTotal],
      [], ['Item Code', 'Item Name', 'Quantity', 'Rate', 'Amount'],
      ...boq.items.map((item) => [item.itemCode, item.itemName, item.quantity, item.rate, item.amount]),
    ];
    const csv = rows.map((row) => row.join(',')).join('\n');
    downloadFile(csv, `${boq.boqNumber}.csv`, 'text/csv;charset=utf-8;');
  };

  const columns = [
    { title: '#', key: 'sno', width: 50, render: (_: unknown, __: unknown, index: number) => <Text style={{ fontSize: 12, color: '#999' }}>{index + 1}</Text> },
    { title: 'BOQ No', dataIndex: 'boqNumber', key: 'boqNumber', width: 160, render: (no: string) => <Text code style={{ fontSize: 11, color: '#f97316' }}>{no}</Text> },
    { title: 'Project', dataIndex: 'project', key: 'project', width: 150 },
    { title: 'Client', dataIndex: 'client', key: 'client', width: 130 },
    { title: 'BOQ Name', dataIndex: 'boqName', key: 'boqName', width: 200 },
    {
      title: 'Status', dataIndex: 'status', key: 'status', width: 120,
      render: (status: string) => <Tag color={statusColor[status] || 'default'}>{status}</Tag>,
      filters: statusOptions.map((s) => ({ text: s, value: s })),
      onFilter: (value: boolean | React.Key, record: BoqRecord) => record.status === value,
    },
    {
      title: 'Grand Total', dataIndex: ['summary', 'grandTotal'], key: 'grandTotal', width: 140, align: 'right' as const,
      render: (total: number) => <Text strong style={{ whiteSpace: 'nowrap' }}>{formatCurrency(total)}</Text>,
      sorter: (a: BoqRecord, b: BoqRecord) => a.summary.grandTotal - b.summary.grandTotal,
    },
    {
      title: '', key: 'actions', width: 180,
      render: (_: unknown, record: BoqRecord) => (
        <Space size={0}>
          <Button type="text" icon={<EyeOutlined />} onClick={() => openView(record)} style={{ color: '#1677ff' }} size="small" />
          <Button type="text" icon={<EditOutlined />} onClick={() => openEditForm(record)} style={{ color: '#f97316' }} size="small" />
          <Popconfirm title="Duplicate this BOQ?" onConfirm={() => handleDuplicate(record)} okText="Duplicate" cancelText="Cancel">
            <Button type="text" icon={<CopyOutlined />} style={{ color: '#722ed1' }} size="small" />
          </Popconfirm>
          <Popconfirm title="Approve this BOQ?" onConfirm={() => handleApprove(record.id)} okText="Approve" cancelText="Cancel">
            <Button type="text" icon={<CheckCircleOutlined />} style={{ color: '#52c41a' }} size="small" />
          </Popconfirm>
          <Button type="text" icon={<DownloadOutlined />} onClick={() => exportPdf(record)} style={{ color: '#555' }} size="small" />
          <Popconfirm title="Delete this BOQ?" onConfirm={() => handleDelete(record.id)} okText="Delete" cancelText="Cancel" okButtonProps={{ danger: true }}>
            <Button type="text" icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="BOQ"
        subtitle="Enterprise BOQ management with CRUD, approval, revisions, and exports"
        icon={<FolderOpenOutlined />}
        action={<Button type="primary" icon={<PlusOutlined />} onClick={openNewForm}>New BOQ</Button>}
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <Input.Search placeholder="Search BOQ number, project, client, or name" value={search} onChange={(e) => setSearch(e.target.value)} allowClear style={{ width: 340 }} />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          allowClear
          placeholder="All Status"
          style={{ width: 140 }}
          options={statusOptions.map((s) => ({ value: s, label: s }))}
        />
      </div>

      <Table
        dataSource={filteredBoqs}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} BOQs` }}
        locale={{ emptyText: 'No BOQs yet. Create one to get started.' }}
        style={{ background: '#fff', borderRadius: 12 }}
        size="middle"
      />

      <Drawer
        title={editingId ? 'Edit BOQ' : 'Create BOQ'}
        placement="right"
        width={800}
        open={editorOpen}
        onClose={() => { setEditorOpen(false); setEditingId(null); }}
        extra={
          <Space>
            <Button onClick={() => { setEditorOpen(false); setEditingId(null); }}>Cancel</Button>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} onClick={() => { const form = document.querySelector('#boq-editor-form') as HTMLFormElement; form?.requestSubmit(); }}>
              {editingId ? 'Update BOQ' : 'Save BOQ'}
            </Button>
          </Space>
        }
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'header', label: 'Header' },
            { key: 'items', label: 'Items' },
            { key: 'materials', label: 'Materials' },
            { key: 'labour', label: 'Labour' },
            { key: 'equipment', label: 'Equipment' },
            { key: 'summary', label: 'Summary' },
            { key: 'attachments', label: 'Attachments' },
            { key: 'history', label: 'History' },
          ]}
        />

        <form id="boq-editor-form" onSubmit={handleSubmit} style={{ marginTop: 16 }}>
          {activeTab === 'header' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <Form.Item label="BOQ Number"><Input value={formData.boqNumber} readOnly style={{ background: '#f5f5f5' }} /></Form.Item>
              <Form.Item label="Project *"><Input value={formData.project} onChange={(e) => updateForm('project', e.target.value)} placeholder="Project name" /></Form.Item>
              <Form.Item label="Client"><Input value={formData.client} onChange={(e) => updateForm('client', e.target.value)} placeholder="Client name" /></Form.Item>
              <Form.Item label="Project Type"><Input value={formData.projectType} onChange={(e) => updateForm('projectType', e.target.value)} /></Form.Item>
              <Form.Item label="BOQ Name *"><Input value={formData.boqName} onChange={(e) => updateForm('boqName', e.target.value)} placeholder="BOQ name" /></Form.Item>
              <Form.Item label="Revision Number"><Input value={formData.revisionNumber} onChange={(e) => updateForm('revisionNumber', e.target.value)} /></Form.Item>
              <Form.Item label="Version"><Input value={formData.version} onChange={(e) => updateForm('version', e.target.value)} /></Form.Item>
              <Form.Item label="BOQ Date"><input type="date" value={formData.boqDate} onChange={(e) => updateForm('boqDate', e.target.value)} className="ant-input" style={{ width: '100%', height: 32, borderRadius: 8, padding: '0 11px', border: '1px solid #d9d9d9' }} /></Form.Item>
              <Form.Item label="Prepared By"><Input value={formData.preparedBy} onChange={(e) => updateForm('preparedBy', e.target.value)} /></Form.Item>
              <Form.Item label="Checked By"><Input value={formData.checkedBy} onChange={(e) => updateForm('checkedBy', e.target.value)} /></Form.Item>
              <Form.Item label="Approved By"><Input value={formData.approvedBy} onChange={(e) => updateForm('approvedBy', e.target.value)} /></Form.Item>
              <Form.Item label="Status"><Select value={formData.status} onChange={(val) => updateForm('status', val)} style={{ width: '100%' }} options={statusOptions.map((s) => ({ value: s, label: s }))} /></Form.Item>
              <Form.Item label="Work Category"><Select value={formData.workCategory} onChange={(val) => updateForm('workCategory', val)} style={{ width: '100%' }} options={workCategories.map((c) => ({ value: c, label: c }))} /></Form.Item>
              <Form.Item label="Remarks" style={{ gridColumn: '1 / -1' }}><TextArea value={formData.remarks} onChange={(e) => updateForm('remarks', e.target.value)} rows={3} /></Form.Item>
            </div>
          )}

          {activeTab === 'items' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Text strong>BOQ Items</Text><Button size="small" onClick={() => addRow('items')}>+ Add Item</Button></div>
              {formData.items.map((item, index) => (
                <div key={item.id} style={{ border: '1px solid #d9d9d9', borderRadius: 12, padding: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 16px' }}>
                    <Form.Item label="Item Code"><Input value={item.itemCode} onChange={(e) => updateItem(index, 'itemCode', e.target.value)} /></Form.Item>
                    <Form.Item label="Item Name"><Input value={item.itemName} onChange={(e) => updateItem(index, 'itemName', e.target.value)} /></Form.Item>
                    <Form.Item label="Description"><Input value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} /></Form.Item>
                    <Form.Item label="Category"><Input value={item.category} onChange={(e) => updateItem(index, 'category', e.target.value)} /></Form.Item>
                    <Form.Item label="Sub Category"><Input value={item.subCategory} onChange={(e) => updateItem(index, 'subCategory', e.target.value)} /></Form.Item>
                    <Form.Item label="Unit"><Select value={item.unit} onChange={(val) => updateItem(index, 'unit', val)} options={unitOptions.map((u) => ({ value: u, label: u }))} style={{ width: '100%' }} /></Form.Item>
                    <Form.Item label="Length"><InputNumber value={item.length} onChange={(val) => updateItem(index, 'length', val || 0)} style={{ width: '100%' }} /></Form.Item>
                    <Form.Item label="Width"><InputNumber value={item.width} onChange={(val) => updateItem(index, 'width', val || 0)} style={{ width: '100%' }} /></Form.Item>
                    <Form.Item label="Height"><InputNumber value={item.height} onChange={(val) => updateItem(index, 'height', val || 0)} style={{ width: '100%' }} /></Form.Item>
                    <Form.Item label="Thickness"><InputNumber value={item.thickness} onChange={(val) => updateItem(index, 'thickness', val || 0)} style={{ width: '100%' }} /></Form.Item>
                    <Form.Item label="Quantity"><InputNumber min={0} value={item.quantity} onChange={(val) => updateItem(index, 'quantity', val || 0)} style={{ width: '100%' }} /></Form.Item>
                    <Form.Item label="Rate"><InputNumber min={0} value={item.rate} onChange={(val) => updateItem(index, 'rate', val || 0)} style={{ width: '100%' }} /></Form.Item>
                    <Form.Item label="Discount %"><InputNumber value={item.discount} onChange={(val) => updateItem(index, 'discount', val || 0)} style={{ width: '100%' }} /></Form.Item>
                    <Form.Item label="GST %"><InputNumber value={item.gst} onChange={(val) => updateItem(index, 'gst', val || 0)} style={{ width: '100%' }} /></Form.Item>
                    <Form.Item label="Amount"><Input value={formatCurrency(item.amount)} readOnly style={{ background: '#f5f5f5' }} /></Form.Item>
                    <Form.Item label="Remarks"><Input value={item.remarks} onChange={(e) => updateItem(index, 'remarks', e.target.value)} /></Form.Item>
                  </div>
                  {formData.items.length > 1 && <Button type="link" danger size="small" onClick={() => removeRow('items', index)} style={{ marginTop: 8 }}>Remove item</Button>}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'materials' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Text strong>Material Breakdown</Text><Button size="small" onClick={() => addRow('materials')}>+ Add Material</Button></div>
              {formData.materials.map((material, index) => (
                <div key={material.id} style={{ border: '1px solid #d9d9d9', borderRadius: 12, padding: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 16px' }}>
                    <Form.Item label="Material Name"><Input value={material.materialName} onChange={(e) => updateMaterial(index, 'materialName', e.target.value)} /></Form.Item>
                    <Form.Item label="Quantity"><InputNumber value={material.quantity} onChange={(val) => updateMaterial(index, 'quantity', val || 0)} style={{ width: '100%' }} /></Form.Item>
                    <Form.Item label="Unit"><Select value={material.unit} onChange={(val) => updateMaterial(index, 'unit', val)} options={unitOptions.map((u) => ({ value: u, label: u }))} style={{ width: '100%' }} /></Form.Item>
                    <Form.Item label="Rate"><InputNumber value={material.rate} onChange={(val) => updateMaterial(index, 'rate', val || 0)} style={{ width: '100%' }} /></Form.Item>
                    <Form.Item label="Waste %"><InputNumber value={material.wastePercentage} onChange={(val) => updateMaterial(index, 'wastePercentage', val || 0)} style={{ width: '100%' }} /></Form.Item>
                    <Form.Item label="Supplier"><Input value={material.supplier} onChange={(e) => updateMaterial(index, 'supplier', e.target.value)} /></Form.Item>
                    <Form.Item label="Amount"><Input value={formatCurrency(material.amount)} readOnly style={{ background: '#f5f5f5' }} /></Form.Item>
                  </div>
                  {formData.materials.length > 1 && <Button type="link" danger size="small" onClick={() => removeRow('materials', index)} style={{ marginTop: 8 }}>Remove material</Button>}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'labour' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Text strong>Labour Breakdown</Text><Button size="small" onClick={() => addRow('labours')}>+ Add Labour</Button></div>
              {formData.labours.map((labour, index) => (
                <div key={labour.id} style={{ border: '1px solid #d9d9d9', borderRadius: 12, padding: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                    <Form.Item label="Labour Type"><Input value={labour.labourType} onChange={(e) => updateLabour(index, 'labourType', e.target.value)} /></Form.Item>
                    <Form.Item label="No. of Workers"><InputNumber value={labour.noOfWorkers} onChange={(val) => updateLabour(index, 'noOfWorkers', val || 0)} style={{ width: '100%' }} /></Form.Item>
                    <Form.Item label="Working Days"><InputNumber value={labour.workingDays} onChange={(val) => updateLabour(index, 'workingDays', val || 0)} style={{ width: '100%' }} /></Form.Item>
                    <Form.Item label="Rate / Day"><InputNumber value={labour.ratePerDay} onChange={(val) => updateLabour(index, 'ratePerDay', val || 0)} style={{ width: '100%' }} /></Form.Item>
                    <Form.Item label="Total Amount"><Input value={formatCurrency(labour.totalAmount)} readOnly style={{ background: '#f5f5f5' }} /></Form.Item>
                  </div>
                  {formData.labours.length > 1 && <Button type="link" danger size="small" onClick={() => removeRow('labours', index)} style={{ marginTop: 8 }}>Remove labour</Button>}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'equipment' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Text strong>Equipment Breakdown</Text><Button size="small" onClick={() => addRow('equipments')}>+ Add Equipment</Button></div>
              {formData.equipments.map((equipment, index) => (
                <div key={equipment.id} style={{ border: '1px solid #d9d9d9', borderRadius: 12, padding: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                    <Form.Item label="Equipment Name"><Input value={equipment.equipmentName} onChange={(e) => updateEquipment(index, 'equipmentName', e.target.value)} /></Form.Item>
                    <Form.Item label="Hours"><InputNumber value={equipment.hours} onChange={(val) => updateEquipment(index, 'hours', val || 0)} style={{ width: '100%' }} /></Form.Item>
                    <Form.Item label="Rate"><InputNumber value={equipment.rate} onChange={(val) => updateEquipment(index, 'rate', val || 0)} style={{ width: '100%' }} /></Form.Item>
                    <Form.Item label="Amount"><Input value={formatCurrency(equipment.amount)} readOnly style={{ background: '#f5f5f5' }} /></Form.Item>
                  </div>
                  {formData.equipments.length > 1 && <Button type="link" danger size="small" onClick={() => removeRow('equipments', index)} style={{ marginTop: 8 }}>Remove equipment</Button>}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'summary' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <Form.Item label="Transportation Cost"><InputNumber value={formData.summary.transportationCost} onChange={(val) => setFormData((prev) => ({ ...prev, summary: { ...prev.summary, transportationCost: val || 0 } }))} style={{ width: '100%' }} /></Form.Item>
              <Form.Item label="Sub Contractor Cost"><InputNumber value={formData.summary.subContractorCost} onChange={(val) => setFormData((prev) => ({ ...prev, summary: { ...prev.summary, subContractorCost: val || 0 } }))} style={{ width: '100%' }} /></Form.Item>
              <Form.Item label="Miscellaneous"><InputNumber value={formData.summary.miscellaneous} onChange={(val) => setFormData((prev) => ({ ...prev, summary: { ...prev.summary, miscellaneous: val || 0 } }))} style={{ width: '100%' }} /></Form.Item>
              <Form.Item label="Discount %"><InputNumber value={formData.summary.discount} onChange={(val) => setFormData((prev) => ({ ...prev, summary: { ...prev.summary, discount: val || 0 } }))} style={{ width: '100%' }} /></Form.Item>
              <Form.Item label="GST %"><InputNumber value={formData.summary.gst} onChange={(val) => setFormData((prev) => ({ ...prev, summary: { ...prev.summary, gst: val || 0 } }))} style={{ width: '100%' }} /></Form.Item>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ border: '1px solid #d9d9d9', borderRadius: 12, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><Text>Material Cost</Text><Text>{formatCurrency(calculateSummary(formData).materialCost)}</Text></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><Text>Labour Cost</Text><Text>{formatCurrency(calculateSummary(formData).labourCost)}</Text></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><Text>Equipment Cost</Text><Text>{formatCurrency(calculateSummary(formData).equipmentCost)}</Text></div>
                  <Divider style={{ margin: '8px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><Text>Discount</Text><Text>{formatCurrency(calculateSummary(formData).discount)}</Text></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><Text>GST</Text><Text>{formatCurrency(calculateSummary(formData).gst)}</Text></div>
                  <Divider style={{ margin: '8px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text strong style={{ fontSize: 16 }}>Grand Total</Text><Text strong style={{ fontSize: 16 }}>{formatCurrency(calculateSummary(formData).grandTotal)}</Text></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attachments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Text strong>Attachments</Text><Button size="small" onClick={() => addRow('attachments')}>+ Add Attachment</Button></div>
              {formData.attachments.map((attachment, index) => (
                <div key={attachment.id} style={{ border: '1px solid #d9d9d9', borderRadius: 12, padding: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                    <Form.Item label="Attachment Name"><Input value={attachment.name} onChange={(e) => updateAttachment(index, 'name', e.target.value)} /></Form.Item>
                    <Form.Item label="Type"><Input value={attachment.type} onChange={(e) => updateAttachment(index, 'type', e.target.value)} /></Form.Item>
                  </div>
                  {formData.attachments.length > 1 && <Button type="link" danger size="small" onClick={() => removeRow('attachments', index)} style={{ marginTop: 8 }}>Remove attachment</Button>}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(formData.revisions.length ? formData.revisions : [{ id: 'initial', revisionNumber: formData.revisionNumber, version: formData.version, status: formData.status, updatedAt: formData.boqDate, note: 'Pending' }]).map((revision) => (
                <div key={revision.id} style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #d9d9d9', borderRadius: 8, padding: 12 }}>
                  <div><Text strong>{revision.revisionNumber} · {revision.version}</Text><br /><Text type="secondary">{revision.note}</Text></div>
                  <div style={{ textAlign: 'right' }}><Tag color={statusColor[revision.status] || 'default'}>{revision.status}</Tag><br /><Text type="secondary">{revision.updatedAt}</Text></div>
                </div>
              ))}
            </div>
          )}
        </form>
      </Drawer>

      <Modal
        title={selectedBoq?.boqName || 'BOQ Details'}
        open={viewModalOpen}
        onCancel={() => { setViewModalOpen(false); setSelectedBoq(null); }}
        footer={
          selectedBoq ? (
            <Space>
              <Button icon={<DownloadOutlined />} onClick={() => exportPdf(selectedBoq)}>Export PDF</Button>
              <Button icon={<DownloadOutlined />} onClick={() => exportExcel(selectedBoq)}>Export Excel</Button>
              <Button icon={<PrinterOutlined />} onClick={() => window.print()}>Print</Button>
            </Space>
          ) : null
        }
        width={700}
      >
        {selectedBoq && (
          <div style={{ marginTop: 8 }}>
            <Descriptions column={2} size="small" bordered>
              <Descriptions.Item label="BOQ No">{selectedBoq.boqNumber}</Descriptions.Item>
              <Descriptions.Item label="Status"><Tag color={statusColor[selectedBoq.status] || 'default'}>{selectedBoq.status}</Tag></Descriptions.Item>
              <Descriptions.Item label="Project">{selectedBoq.project}</Descriptions.Item>
              <Descriptions.Item label="Client">{selectedBoq.client}</Descriptions.Item>
              <Descriptions.Item label="Project Type">{selectedBoq.projectType}</Descriptions.Item>
              <Descriptions.Item label="Work Category">{selectedBoq.workCategory}</Descriptions.Item>
              <Descriptions.Item label="Revision">{selectedBoq.revisionNumber}</Descriptions.Item>
              <Descriptions.Item label="Version">{selectedBoq.version}</Descriptions.Item>
              <Descriptions.Item label="Prepared By">{selectedBoq.preparedBy || '—'}</Descriptions.Item>
              <Descriptions.Item label="Checked By">{selectedBoq.checkedBy || '—'}</Descriptions.Item>
              <Descriptions.Item label="Approved By">{selectedBoq.approvedBy || '—'}</Descriptions.Item>
              <Descriptions.Item label="BOQ Date">{selectedBoq.boqDate || '—'}</Descriptions.Item>
            </Descriptions>

            {selectedBoq.remarks && <div style={{ marginTop: 16 }}><Text type="secondary">Remarks: {selectedBoq.remarks}</Text></div>}

            <Divider />
            <Text strong>Items</Text>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedBoq.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #d9d9d9', borderRadius: 8, padding: 12 }}>
                  <div><Text strong>{item.itemName}</Text><br /><Text type="secondary">{item.description}</Text></div>
                  <div style={{ textAlign: 'right' }}><Text>Qty {item.quantity}</Text><br /><Text strong>{formatCurrency(item.amount)}</Text></div>
                </div>
              ))}
            </div>

            <Divider />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18 }}><Text strong>Grand Total</Text><Text strong>{formatCurrency(selectedBoq.summary.grandTotal)}</Text></div>
          </div>
        )}
      </Modal>
    </div>
  );
}
