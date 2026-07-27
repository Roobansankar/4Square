'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';

export interface SiteProgressWorkItem {
  id: string;
  workCategory: string;
  subCategory: string;
  activityName: string;
  boqItem: string;
  workDescription: string;
  plannedQuantity: number;
  completedToday: number;
  totalCompleted: number;
  remainingQuantity: number;
  completionPercentage: number;
  unit: string;
  remarks: string;
}

export interface SiteProgressLabour {
  id: string;
  labourType: string;
  contractor: string;
  skilledWorkers: number;
  semiSkilledWorkers: number;
  helpers: number;
  maleCount: number;
  femaleCount: number;
  totalLabour: number;
  workingHours: number;
  overtimeHours: number;
}

export interface SiteProgressMaterial {
  id: string;
  materialName: string;
  openingStock: number;
  receivedToday: number;
  consumedToday: number;
  closingStock: number;
  unit: string;
  remarks: string;
}

export interface SiteProgressEquipment {
  id: string;
  equipmentName: string;
  operator: string;
  workingHours: number;
  idleHours: number;
  fuelConsumed: number;
  condition: string;
  remarks: string;
}

export interface SiteProgressIssue {
  id: string;
  issueTitle: string;
  issueDescription: string;
  priority: string;
  assignedTo: string;
  targetDate: string;
  status: string;
}

export interface SiteProgressAttachment {
  id: string;
  title: string;
  type: string;
  url: string;
}

export interface SiteProgressApproval {
  preparedBy: string;
  verifiedBy: string;
  approvedBy: string;
  approvalDate: string;
  approvalStatus: string;
}

export interface SiteProgressRecord {
  id: string;
  progressNumber: string;
  project: string;
  client: string;
  site: string;
  reportDate: string;
  dayNumber: number;
  reportingEngineer: string;
  supervisor: string;
  contractor: string;
  status: string;
  gpsLocation: string;
  weatherInfo: string;
  temperature: string;
  rain: string;
  wind: string;
  workingCondition: string;
  dailyNotes: string;
  issueTracking: string;
  delayTracking: string;
  riskManagement: string;
  workItems: SiteProgressWorkItem[];
  labourDetails: SiteProgressLabour[];
  materialConsumption: SiteProgressMaterial[];
  equipmentDetails: SiteProgressEquipment[];
  issues: SiteProgressIssue[];
  attachments: SiteProgressAttachment[];
  approval: SiteProgressApproval;
  createdAt: string;
  updatedAt: string;
}

interface SiteProgressFormProps {
  initialData?: SiteProgressRecord | null;
  onSave: (record: SiteProgressRecord) => void;
  onCancel: () => void;
}

const STORAGE_KEY = '4square-site-progress';
const statusOptions = ['Draft', 'Submitted', 'Approved', 'Rejected', 'Revision'];
const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];
const unitOptions = ['Nos', 'Sq.ft', 'Sq.m', 'Cum', 'Cft', 'Kg', 'Bag', 'Litre', 'Hours'];
const conditionOptions = ['Good', 'Fair', 'Needs Service', 'Down'];

function createEmptyWorkItem(): SiteProgressWorkItem {
  return {
    id: `w-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    workCategory: '',
    subCategory: '',
    activityName: '',
    boqItem: '',
    workDescription: '',
    plannedQuantity: 0,
    completedToday: 0,
    totalCompleted: 0,
    remainingQuantity: 0,
    completionPercentage: 0,
    unit: 'Nos',
    remarks: '',
  };
}

function createEmptyLabour(): SiteProgressLabour {
  return {
    id: `l-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    labourType: '',
    contractor: '',
    skilledWorkers: 0,
    semiSkilledWorkers: 0,
    helpers: 0,
    maleCount: 0,
    femaleCount: 0,
    totalLabour: 0,
    workingHours: 0,
    overtimeHours: 0,
  };
}

function createEmptyMaterial(): SiteProgressMaterial {
  return {
    id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    materialName: '',
    openingStock: 0,
    receivedToday: 0,
    consumedToday: 0,
    closingStock: 0,
    unit: 'Nos',
    remarks: '',
  };
}

function createEmptyEquipment(): SiteProgressEquipment {
  return {
    id: `e-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    equipmentName: '',
    operator: '',
    workingHours: 0,
    idleHours: 0,
    fuelConsumed: 0,
    condition: 'Good',
    remarks: '',
  };
}

function createEmptyIssue(): SiteProgressIssue {
  return {
    id: `i-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    issueTitle: '',
    issueDescription: '',
    priority: 'Medium',
    assignedTo: '',
    targetDate: '',
    status: 'Open',
  };
}

function createEmptyAttachment(): SiteProgressAttachment {
  return {
    id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: '',
    type: 'Photo',
    url: '',
  };
}

function generateProgressNumber() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `SP-${datePart}-${Math.floor(Math.random() * 900 + 100)}`;
}

function createInitialState(existing: SiteProgressRecord[] = []): SiteProgressRecord {
  const existingNumbers = existing.map((item) => item.progressNumber);
  let progressNumber = generateProgressNumber();
  while (existingNumbers.includes(progressNumber)) {
    progressNumber = generateProgressNumber();
  }

  return {
    id: '',
    progressNumber,
    project: '',
    client: '',
    site: '',
    reportDate: new Date().toISOString().slice(0, 10),
    dayNumber: 1,
    reportingEngineer: '',
    supervisor: '',
    contractor: '',
    status: 'Draft',
    gpsLocation: '',
    weatherInfo: 'Sunny',
    temperature: '32°C',
    rain: '0%',
    wind: '8 km/h',
    workingCondition: 'Normal',
    dailyNotes: '',
    issueTracking: '',
    delayTracking: '',
    riskManagement: '',
    workItems: [createEmptyWorkItem()],
    labourDetails: [createEmptyLabour()],
    materialConsumption: [createEmptyMaterial()],
    equipmentDetails: [createEmptyEquipment()],
    issues: [createEmptyIssue()],
    attachments: [createEmptyAttachment()],
    approval: {
      preparedBy: '',
      verifiedBy: '',
      approvedBy: '',
      approvalDate: '',
      approvalStatus: 'Pending',
    },
    createdAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

export default function SiteProgressForm({ initialData, onSave, onCancel }: SiteProgressFormProps) {
  const [formData, setFormData] = useState<SiteProgressRecord>(() => createInitialState([]));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const records = JSON.parse(stored) as SiteProgressRecord[];
        setFormData(createInitialState(records));
      }
    }
  }, [initialData]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.project.trim()) nextErrors.project = 'Project is required';
    if (!formData.reportDate) nextErrors.reportDate = 'Report date is required';
    if (!formData.workItems.length || !formData.workItems.some((item) => item.activityName.trim())) {
      nextErrors.workItems = 'At least one work activity is required';
    }
    formData.workItems.forEach((item, index) => {
      if (item.completedToday > item.plannedQuantity) {
        nextErrors[`workItem-${index}`] = 'Completed today cannot exceed planned quantity';
      }
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const updateField = (field: keyof SiteProgressRecord, value: string | number | SiteProgressApproval) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateApprovalField = (field: keyof SiteProgressApproval, value: string) => {
    setFormData((prev) => ({ ...prev, approval: { ...prev.approval, [field]: value } }));
  };

  const addRow = (section: 'workItems' | 'labourDetails' | 'materialConsumption' | 'equipmentDetails' | 'issues' | 'attachments') => {
    if (section === 'workItems') setFormData((prev) => ({ ...prev, workItems: [...prev.workItems, createEmptyWorkItem()] }));
    if (section === 'labourDetails') setFormData((prev) => ({ ...prev, labourDetails: [...prev.labourDetails, createEmptyLabour()] }));
    if (section === 'materialConsumption') setFormData((prev) => ({ ...prev, materialConsumption: [...prev.materialConsumption, createEmptyMaterial()] }));
    if (section === 'equipmentDetails') setFormData((prev) => ({ ...prev, equipmentDetails: [...prev.equipmentDetails, createEmptyEquipment()] }));
    if (section === 'issues') setFormData((prev) => ({ ...prev, issues: [...prev.issues, createEmptyIssue()] }));
    if (section === 'attachments') setFormData((prev) => ({ ...prev, attachments: [...prev.attachments, createEmptyAttachment()] }));
  };

  const removeRow = (section: 'workItems' | 'labourDetails' | 'materialConsumption' | 'equipmentDetails' | 'issues' | 'attachments', index: number) => {
    setFormData((prev) => {
      const next = { ...prev };
      if (section === 'workItems' && prev.workItems.length > 1) next.workItems = prev.workItems.filter((_, idx) => idx !== index);
      if (section === 'labourDetails' && prev.labourDetails.length > 1) next.labourDetails = prev.labourDetails.filter((_, idx) => idx !== index);
      if (section === 'materialConsumption' && prev.materialConsumption.length > 1) next.materialConsumption = prev.materialConsumption.filter((_, idx) => idx !== index);
      if (section === 'equipmentDetails' && prev.equipmentDetails.length > 1) next.equipmentDetails = prev.equipmentDetails.filter((_, idx) => idx !== index);
      if (section === 'issues' && prev.issues.length > 1) next.issues = prev.issues.filter((_, idx) => idx !== index);
      if (section === 'attachments' && prev.attachments.length > 1) next.attachments = prev.attachments.filter((_, idx) => idx !== index);
      return next;
    });
  };

  const updateWorkItem = (index: number, field: keyof SiteProgressWorkItem, value: string | number) => {
    setFormData((prev) => {
      const next = [...prev.workItems];
      next[index] = { ...next[index], [field]: value } as SiteProgressWorkItem;
      next[index].remainingQuantity = (next[index].plannedQuantity || 0) - (next[index].totalCompleted || 0);
      next[index].completionPercentage = Math.min(100, Math.round(((next[index].totalCompleted || 0) / (next[index].plannedQuantity || 1)) * 100));
      return { ...prev, workItems: next };
    });
  };

  const updateLabour = (index: number, field: keyof SiteProgressLabour, value: string | number) => {
    setFormData((prev) => {
      const next = [...prev.labourDetails];
      next[index] = { ...next[index], [field]: value } as SiteProgressLabour;
      next[index].totalLabour = (next[index].skilledWorkers || 0) + (next[index].semiSkilledWorkers || 0) + (next[index].helpers || 0);
      return { ...prev, labourDetails: next };
    });
  };

  const updateMaterial = (index: number, field: keyof SiteProgressMaterial, value: string | number) => {
    setFormData((prev) => {
      const next = [...prev.materialConsumption];
      next[index] = { ...next[index], [field]: value } as SiteProgressMaterial;
      next[index].closingStock = (next[index].openingStock || 0) + (next[index].receivedToday || 0) - (next[index].consumedToday || 0);
      return { ...prev, materialConsumption: next };
    });
  };

  const updateEquipment = (index: number, field: keyof SiteProgressEquipment, value: string | number) => {
    setFormData((prev) => {
      const next = [...prev.equipmentDetails];
      next[index] = { ...next[index], [field]: value } as SiteProgressEquipment;
      return { ...prev, equipmentDetails: next };
    });
  };

  const updateIssue = (index: number, field: keyof SiteProgressIssue, value: string) => {
    setFormData((prev) => {
      const next = [...prev.issues];
      next[index] = { ...next[index], [field]: value } as SiteProgressIssue;
      return { ...prev, issues: next };
    });
  };

  const updateAttachment = (index: number, field: keyof SiteProgressAttachment, value: string) => {
    setFormData((prev) => {
      const next = [...prev.attachments];
      next[index] = { ...next[index], [field]: value } as SiteProgressAttachment;
      return { ...prev, attachments: next };
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    const payload: SiteProgressRecord = {
      ...formData,
      id: formData.id || `sp-${Date.now()}`,
      updatedAt: new Date().toISOString().slice(0, 10),
      createdAt: formData.createdAt || new Date().toISOString().slice(0, 10),
      workItems: formData.workItems.map((item) => ({ ...item, remainingQuantity: item.plannedQuantity - item.totalCompleted, completionPercentage: item.totalCompleted > 0 ? Math.min(100, Math.round((item.totalCompleted / item.plannedQuantity) * 100)) : 0 })),
      labourDetails: formData.labourDetails.map((labour) => ({ ...labour, totalLabour: labour.skilledWorkers + labour.semiSkilledWorkers + labour.helpers })),
      materialConsumption: formData.materialConsumption.map((material) => ({ ...material, closingStock: material.openingStock + material.receivedToday - material.consumedToday })),
    };

    onSave(payload);
  };

  const summary = useMemo(() => {
    const completed = formData.workItems.reduce((sum, item) => sum + item.totalCompleted, 0);
    const planned = formData.workItems.reduce((sum, item) => sum + item.plannedQuantity, 0);
    const progressPercent = planned > 0 ? Math.round((completed / planned) * 100) : 0;
    const labour = formData.labourDetails.reduce((sum, item) => sum + item.totalLabour, 0);
    const openIssues = formData.issues.filter((item) => item.status !== 'Closed').length;
    return { progressPercent, labour, openIssues };
  }, [formData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="space-y-1"><label className="text-sm font-medium">Progress Number</label><input value={formData.progressNumber} readOnly className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm" /></div>
        <div className="space-y-1"><label className="text-sm font-medium">Project</label><input value={formData.project} onChange={(event) => updateField('project', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /><p className="text-xs text-red-500">{errors.project}</p></div>
        <div className="space-y-1"><label className="text-sm font-medium">Client</label><input value={formData.client} onChange={(event) => updateField('client', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
        <div className="space-y-1"><label className="text-sm font-medium">Site</label><input value={formData.site} onChange={(event) => updateField('site', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
        <div className="space-y-1"><label className="text-sm font-medium">Report Date</label><input type="date" value={formData.reportDate} onChange={(event) => updateField('reportDate', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /><p className="text-xs text-red-500">{errors.reportDate}</p></div>
        <div className="space-y-1"><label className="text-sm font-medium">Day Number</label><input type="number" value={formData.dayNumber} onChange={(event) => updateField('dayNumber', Number(event.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
        <div className="space-y-1"><label className="text-sm font-medium">Reporting Engineer</label><input value={formData.reportingEngineer} onChange={(event) => updateField('reportingEngineer', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
        <div className="space-y-1"><label className="text-sm font-medium">Supervisor</label><input value={formData.supervisor} onChange={(event) => updateField('supervisor', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
        <div className="space-y-1"><label className="text-sm font-medium">Contractor</label><input value={formData.contractor} onChange={(event) => updateField('contractor', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
        <div className="space-y-1"><label className="text-sm font-medium">Status</label><select value={formData.status} onChange={(event) => updateField('status', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm">{statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select></div>
        <div className="space-y-1"><label className="text-sm font-medium">GPS Location</label><input value={formData.gpsLocation} onChange={(event) => updateField('gpsLocation', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
        <div className="space-y-1"><label className="text-sm font-medium">Weather Information</label><input value={formData.weatherInfo} onChange={(event) => updateField('weatherInfo', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
        <div className="space-y-1"><label className="text-sm font-medium">Temperature</label><input value={formData.temperature} onChange={(event) => updateField('temperature', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
        <div className="space-y-1"><label className="text-sm font-medium">Rain</label><input value={formData.rain} onChange={(event) => updateField('rain', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
        <div className="space-y-1"><label className="text-sm font-medium">Wind</label><input value={formData.wind} onChange={(event) => updateField('wind', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
        <div className="space-y-1"><label className="text-sm font-medium">Working Condition</label><input value={formData.workingCondition} onChange={(event) => updateField('workingCondition', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
        <div className="space-y-1 md:col-span-2 xl:col-span-3"><label className="text-sm font-medium">Daily Notes</label><textarea value={formData.dailyNotes} onChange={(event) => updateField('dailyNotes', event.target.value)} rows={3} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
        <div className="space-y-1 md:col-span-2 xl:col-span-3"><label className="text-sm font-medium">Issue Tracking</label><textarea value={formData.issueTracking} onChange={(event) => updateField('issueTracking', event.target.value)} rows={3} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
        <div className="space-y-1 md:col-span-2 xl:col-span-3"><label className="text-sm font-medium">Delay Tracking</label><textarea value={formData.delayTracking} onChange={(event) => updateField('delayTracking', event.target.value)} rows={3} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
        <div className="space-y-1 md:col-span-2 xl:col-span-3"><label className="text-sm font-medium">Risk Management</label><textarea value={formData.riskManagement} onChange={(event) => updateField('riskManagement', event.target.value)} rows={3} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
      </div>

      <div className="rounded-xl border border-[var(--border)] p-4 space-y-3">
        <div className="flex items-center justify-between"><h3 className="font-semibold text-[var(--foreground)]">Work Progress</h3><button type="button" onClick={() => addRow('workItems')} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm">Add Activity</button></div>
        {formData.workItems.map((item, index) => (
          <div key={item.id} className="rounded-lg border border-[var(--border)] p-3 space-y-3">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <div className="space-y-1"><label className="text-xs font-medium">Work Category</label><input value={item.workCategory} onChange={(event) => updateWorkItem(index, 'workCategory', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
              <div className="space-y-1"><label className="text-xs font-medium">Sub Category</label><input value={item.subCategory} onChange={(event) => updateWorkItem(index, 'subCategory', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
              <div className="space-y-1"><label className="text-xs font-medium">Activity Name</label><input value={item.activityName} onChange={(event) => updateWorkItem(index, 'activityName', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
              <div className="space-y-1"><label className="text-xs font-medium">BOQ Item</label><input value={item.boqItem} onChange={(event) => updateWorkItem(index, 'boqItem', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
              <div className="space-y-1"><label className="text-xs font-medium">Planned Quantity</label><input type="number" value={item.plannedQuantity} onChange={(event) => updateWorkItem(index, 'plannedQuantity', Number(event.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
              <div className="space-y-1"><label className="text-xs font-medium">Completed Today</label><input type="number" value={item.completedToday} onChange={(event) => updateWorkItem(index, 'completedToday', Number(event.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
              <div className="space-y-1"><label className="text-xs font-medium">Total Completed</label><input type="number" value={item.totalCompleted} onChange={(event) => updateWorkItem(index, 'totalCompleted', Number(event.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
              <div className="space-y-1"><label className="text-xs font-medium">Remaining Quantity</label><input value={item.remainingQuantity} readOnly className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm" /></div>
              <div className="space-y-1"><label className="text-xs font-medium">Completion %</label><input value={item.completionPercentage} readOnly className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm" /></div>
              <div className="space-y-1"><label className="text-xs font-medium">Unit</label><select value={item.unit} onChange={(event) => updateWorkItem(index, 'unit', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm">{unitOptions.map((unit) => <option key={unit} value={unit}>{unit}</option>)}</select></div>
              <div className="space-y-1 md:col-span-2 xl:col-span-3"><label className="text-xs font-medium">Work Description</label><textarea value={item.workDescription} onChange={(event) => updateWorkItem(index, 'workDescription', event.target.value)} rows={2} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
              <div className="space-y-1 md:col-span-2 xl:col-span-3"><label className="text-xs font-medium">Remarks</label><textarea value={item.remarks} onChange={(event) => updateWorkItem(index, 'remarks', event.target.value)} rows={2} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            </div>
            {formData.workItems.length > 1 && <button type="button" onClick={() => removeRow('workItems', index)} className="text-xs text-red-500">Remove activity</button>}
            <p className="text-xs text-red-500">{errors[`workItem-${index}`]}</p>
          </div>
        ))}
        <p className="text-xs text-red-500">{errors.workItems}</p>
      </div>

      <div className="rounded-xl border border-[var(--border)] p-4 space-y-3">
        <div className="flex items-center justify-between"><h3 className="font-semibold text-[var(--foreground)]">Labour Details</h3><button type="button" onClick={() => addRow('labourDetails')} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm">Add Labour</button></div>
        {formData.labourDetails.map((labour, index) => (
          <div key={labour.id} className="rounded-lg border border-[var(--border)] p-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-1"><label className="text-xs font-medium">Labour Type</label><input value={labour.labourType} onChange={(event) => updateLabour(index, 'labourType', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Contractor</label><input value={labour.contractor} onChange={(event) => updateLabour(index, 'contractor', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Skilled Workers</label><input type="number" value={labour.skilledWorkers} onChange={(event) => updateLabour(index, 'skilledWorkers', Number(event.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Semi Skilled Workers</label><input type="number" value={labour.semiSkilledWorkers} onChange={(event) => updateLabour(index, 'semiSkilledWorkers', Number(event.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Helpers</label><input type="number" value={labour.helpers} onChange={(event) => updateLabour(index, 'helpers', Number(event.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Male Count</label><input type="number" value={labour.maleCount} onChange={(event) => updateLabour(index, 'maleCount', Number(event.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Female Count</label><input type="number" value={labour.femaleCount} onChange={(event) => updateLabour(index, 'femaleCount', Number(event.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Total Labour</label><input value={labour.totalLabour} readOnly className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Working Hours</label><input type="number" value={labour.workingHours} onChange={(event) => updateLabour(index, 'workingHours', Number(event.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Overtime Hours</label><input type="number" value={labour.overtimeHours} onChange={(event) => updateLabour(index, 'overtimeHours', Number(event.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            {formData.labourDetails.length > 1 && <button type="button" onClick={() => removeRow('labourDetails', index)} className="text-xs text-red-500">Remove labour</button>}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--border)] p-4 space-y-3">
        <div className="flex items-center justify-between"><h3 className="font-semibold text-[var(--foreground)]">Material Consumption</h3><button type="button" onClick={() => addRow('materialConsumption')} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm">Add Material</button></div>
        {formData.materialConsumption.map((material, index) => (
          <div key={material.id} className="rounded-lg border border-[var(--border)] p-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-1"><label className="text-xs font-medium">Material Name</label><input value={material.materialName} onChange={(event) => updateMaterial(index, 'materialName', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Opening Stock</label><input type="number" value={material.openingStock} onChange={(event) => updateMaterial(index, 'openingStock', Number(event.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Received Today</label><input type="number" value={material.receivedToday} onChange={(event) => updateMaterial(index, 'receivedToday', Number(event.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Consumed Today</label><input type="number" value={material.consumedToday} onChange={(event) => updateMaterial(index, 'consumedToday', Number(event.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Closing Stock</label><input value={material.closingStock} readOnly className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Unit</label><select value={material.unit} onChange={(event) => updateMaterial(index, 'unit', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm">{unitOptions.map((unit) => <option key={unit} value={unit}>{unit}</option>)}</select></div>
            <div className="space-y-1 md:col-span-2 xl:col-span-3"><label className="text-xs font-medium">Remarks</label><textarea value={material.remarks} onChange={(event) => updateMaterial(index, 'remarks', event.target.value)} rows={2} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            {formData.materialConsumption.length > 1 && <button type="button" onClick={() => removeRow('materialConsumption', index)} className="text-xs text-red-500">Remove material</button>}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--border)] p-4 space-y-3">
        <div className="flex items-center justify-between"><h3 className="font-semibold text-[var(--foreground)]">Equipment Details</h3><button type="button" onClick={() => addRow('equipmentDetails')} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm">Add Equipment</button></div>
        {formData.equipmentDetails.map((equipment, index) => (
          <div key={equipment.id} className="rounded-lg border border-[var(--border)] p-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-1"><label className="text-xs font-medium">Equipment Name</label><input value={equipment.equipmentName} onChange={(event) => updateEquipment(index, 'equipmentName', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Operator</label><input value={equipment.operator} onChange={(event) => updateEquipment(index, 'operator', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Working Hours</label><input type="number" value={equipment.workingHours} onChange={(event) => updateEquipment(index, 'workingHours', Number(event.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Idle Hours</label><input type="number" value={equipment.idleHours} onChange={(event) => updateEquipment(index, 'idleHours', Number(event.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Fuel Consumed</label><input type="number" value={equipment.fuelConsumed} onChange={(event) => updateEquipment(index, 'fuelConsumed', Number(event.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Condition</label><select value={equipment.condition} onChange={(event) => updateEquipment(index, 'condition', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm">{conditionOptions.map((condition) => <option key={condition} value={condition}>{condition}</option>)}</select></div>
            <div className="space-y-1 md:col-span-2 xl:col-span-3"><label className="text-xs font-medium">Remarks</label><textarea value={equipment.remarks} onChange={(event) => updateEquipment(index, 'remarks', event.target.value)} rows={2} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            {formData.equipmentDetails.length > 1 && <button type="button" onClick={() => removeRow('equipmentDetails', index)} className="text-xs text-red-500">Remove equipment</button>}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--border)] p-4 space-y-3">
        <h3 className="font-semibold text-[var(--foreground)]">Quality Check</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1"><label className="text-xs font-medium">Inspection Done</label><input value={formData.issueTracking} onChange={(event) => updateField('issueTracking', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
          <div className="space-y-1"><label className="text-xs font-medium">Quality Status</label><input value={formData.status} onChange={(event) => updateField('status', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
          <div className="space-y-1"><label className="text-xs font-medium">Defects Found</label><input value={formData.dailyNotes} onChange={(event) => updateField('dailyNotes', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
          <div className="space-y-1"><label className="text-xs font-medium">Corrective Action</label><input value={formData.delayTracking} onChange={(event) => updateField('delayTracking', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
          <div className="space-y-1"><label className="text-xs font-medium">Approved By</label><input value={formData.approval.approvedBy} onChange={(event) => updateApprovalField('approvedBy', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] p-4 space-y-3">
        <h3 className="font-semibold text-[var(--foreground)]">Safety Checklist</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1"><label className="text-xs font-medium">Safety Meeting Conducted</label><input value={formData.riskManagement} onChange={(event) => updateField('riskManagement', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
          <div className="space-y-1"><label className="text-xs font-medium">PPE Used</label><input value={formData.weatherInfo} onChange={(event) => updateField('weatherInfo', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
          <div className="space-y-1"><label className="text-xs font-medium">Accidents</label><input value={formData.gpsLocation} onChange={(event) => updateField('gpsLocation', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
          <div className="space-y-1"><label className="text-xs font-medium">Near Miss</label><input value={formData.temperature} onChange={(event) => updateField('temperature', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
          <div className="space-y-1 md:col-span-2"><label className="text-xs font-medium">Unsafe Conditions</label><textarea value={formData.delayTracking} onChange={(event) => updateField('delayTracking', event.target.value)} rows={2} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
          <div className="space-y-1 md:col-span-2"><label className="text-xs font-medium">Safety Remarks</label><textarea value={formData.riskManagement} onChange={(event) => updateField('riskManagement', event.target.value)} rows={2} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] p-4 space-y-3">
        <h3 className="font-semibold text-[var(--foreground)]">Site Issues</h3>
        <div className="flex items-center justify-between"><button type="button" onClick={() => addRow('issues')} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm">Add Issue</button></div>
        {formData.issues.map((issue, index) => (
          <div key={issue.id} className="rounded-lg border border-[var(--border)] p-3 grid gap-3 md:grid-cols-2">
            <div className="space-y-1"><label className="text-xs font-medium">Issue Title</label><input value={issue.issueTitle} onChange={(event) => updateIssue(index, 'issueTitle', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Priority</label><select value={issue.priority} onChange={(event) => updateIssue(index, 'priority', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm">{priorityOptions.map((priority) => <option key={priority} value={priority}>{priority}</option>)}</select></div>
            <div className="space-y-1 md:col-span-2"><label className="text-xs font-medium">Issue Description</label><textarea value={issue.issueDescription} onChange={(event) => updateIssue(index, 'issueDescription', event.target.value)} rows={2} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Assigned To</label><input value={issue.assignedTo} onChange={(event) => updateIssue(index, 'assignedTo', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Target Date</label><input type="date" value={issue.targetDate} onChange={(event) => updateIssue(index, 'targetDate', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Status</label><input value={issue.status} onChange={(event) => updateIssue(index, 'status', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            {formData.issues.length > 1 && <button type="button" onClick={() => removeRow('issues', index)} className="text-xs text-red-500">Remove issue</button>}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--border)] p-4 space-y-3">
        <h3 className="font-semibold text-[var(--foreground)]">Attachments</h3>
        {formData.attachments.map((attachment, index) => (
          <div key={attachment.id} className="rounded-lg border border-[var(--border)] p-3 grid gap-3 md:grid-cols-2">
            <div className="space-y-1"><label className="text-xs font-medium">Title</label><input value={attachment.title} onChange={(event) => updateAttachment(index, 'title', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Type</label><input value={attachment.type} onChange={(event) => updateAttachment(index, 'type', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            <div className="space-y-1 md:col-span-2"><label className="text-xs font-medium">URL or Reference</label><input value={attachment.url} onChange={(event) => updateAttachment(index, 'url', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
            {formData.attachments.length > 1 && <button type="button" onClick={() => removeRow('attachments', index)} className="text-xs text-red-500">Remove attachment</button>}
          </div>
        ))}
        <button type="button" onClick={() => addRow('attachments')} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm">Add Attachment</button>
      </div>

      <div className="rounded-xl border border-[var(--border)] p-4 space-y-3">
        <h3 className="font-semibold text-[var(--foreground)]">Approval</h3>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="space-y-1"><label className="text-xs font-medium">Prepared By</label><input value={formData.approval.preparedBy} onChange={(event) => updateApprovalField('preparedBy', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
          <div className="space-y-1"><label className="text-xs font-medium">Verified By</label><input value={formData.approval.verifiedBy} onChange={(event) => updateApprovalField('verifiedBy', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
          <div className="space-y-1"><label className="text-xs font-medium">Approved By</label><input value={formData.approval.approvedBy} onChange={(event) => updateApprovalField('approvedBy', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
          <div className="space-y-1"><label className="text-xs font-medium">Approval Date</label><input type="date" value={formData.approval.approvalDate} onChange={(event) => updateApprovalField('approvalDate', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
          <div className="space-y-1"><label className="text-xs font-medium">Approval Status</label><input value={formData.approval.approvalStatus} onChange={(event) => updateApprovalField('approvalStatus', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" /></div>
        </div>
      </div>

      <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-4">
        <div className="flex flex-wrap gap-4 text-sm">
          <div><span className="font-semibold">Project Completion:</span> {summary.progressPercent}%</div>
          <div><span className="font-semibold">Today’s Labour:</span> {summary.labour}</div>
          <div><span className="font-semibold">Pending Issues:</span> {summary.openIssues}</div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm"><X size={16} /> Cancel</button>
        <button type="submit" className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white"><Save size={16} /> Save Progress</button>
      </div>
    </form>
  );
}
