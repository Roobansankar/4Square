'use client';

import { useState, useEffect, type FormEvent } from 'react';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import {
  HardHat, Plus, Eye, Edit2, Trash2, X, Calendar, User,
  Users, CheckCircle2, AlertCircle, MapPin, Layers, Hammer,
  Wrench, Clock, ArrowRight, Save, Image, Check, ChevronRight
} from 'lucide-react';

import projectsData from '@/data/projects.json';
import engineersData from '@/data/engineers.json';
import supervisorsData from '@/data/supervisors.json';
import contractorsData from '@/data/contractors.json';

const STORAGE_KEY = '4square-centering-work';

interface CenteringWork {
  id: string;
  projectName: string;
  blockFloor: string;
  date: string;
  engineer: string;
  supervisor: string;
  contractor: string;
  workType: string;
  area: string;
  quantity: string;
  materialsUsed: string;
  carpenters: number;
  helpers: number;
  todaysProgress: string;
  remainingWork: string;
  progressPercent: number;
  status: 'Create' | 'Assign Contractor' | 'Start Work' | 'Daily Progress' | 'Inspection' | 'Approval' | 'Completed';
  photos: string[];
  remarks: string;
}

const workflowSteps = [
  'Create',
  'Assign Contractor',
  'Start Work',
  'Daily Progress',
  'Inspection',
  'Approval',
  'Completed',
] as const;

type WorkflowStatus = typeof workflowSteps[number];

const statusColors: Record<WorkflowStatus, { bg: string; text: string; border: string }> = {
  'Create': { bg: 'bg-slate-100 dark:bg-slate-900/30', text: 'text-slate-700 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-800' },
  'Assign Contractor': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
  'Start Work': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  'Daily Progress': { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800' },
  'Inspection': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800' },
  'Approval': { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800' },
  'Completed': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
};

// Preset demo images to simulate upload easily
const presetImages = [
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
];

const initialMockRecords: CenteringWork[] = [
  {
    id: 'CW-001',
    projectName: 'Skyline Tower Residency',
    blockFloor: 'Block A / Floor 3',
    date: '2026-07-15',
    engineer: 'Arjun Sharma',
    supervisor: 'Vikram Patel',
    contractor: 'Raj Constructions',
    workType: 'Slab shuttering & support props',
    area: '2400 sq.ft',
    quantity: '80 plywood sheets, 120 steel props',
    materialsUsed: 'Plywood sheets, H-beams, Adjustable steel props, wood runner channels',
    carpenters: 6,
    helpers: 8,
    todaysProgress: 'Completed 80% of scaffolding and laid 50% of the plywood deck sheets.',
    remainingWork: 'Remaining plywood layout, edge sealing, and level checking.',
    progressPercent: 65,
    status: 'Daily Progress',
    photos: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=400&q=80'
    ],
    remarks: 'Working at speed. Double-checking level levels using water-level tube.'
  },
  {
    id: 'CW-002',
    projectName: 'Metro Commercial Hub',
    blockFloor: 'Basement 2',
    date: '2026-07-10',
    engineer: 'Kiran Reddy',
    supervisor: 'Anand Kumar',
    contractor: 'Raj Constructions',
    workType: 'Retaining wall formwork',
    area: '1800 sq.ft',
    quantity: '40 steel wall forms, 60 double channel tie rods',
    materialsUsed: 'Steel shuttering plates, Tie-rods, PVC sleeves, Anchors',
    carpenters: 4,
    helpers: 6,
    todaysProgress: 'Completed final tie-rod tightening and alignment checks.',
    remainingWork: 'None. Shuttering is ready for concrete pour.',
    progressPercent: 100,
    status: 'Completed',
    photos: [
      'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=400&q=80'
    ],
    remarks: 'Approved by Structural Engineer Kiran Reddy. Ready for concrete pouring scheduled tomorrow.'
  },
  {
    id: 'CW-003',
    projectName: 'GreenPark Villa Complex',
    blockFloor: 'Villa 4 / Floor 1',
    date: '2026-07-16',
    engineer: 'Suresh Nair',
    supervisor: 'Dinesh Raj',
    contractor: 'Annamalai Steel Works',
    workType: 'Beams & Column junction shuttering',
    area: '850 sq.ft',
    quantity: '25 custom wooden box forms, 40 props',
    materialsUsed: 'Hardwood panels, wooden battens, clamp adjusters',
    carpenters: 5,
    helpers: 4,
    todaysProgress: 'Completed setting up column boxes and level adjustment for beam bottoms.',
    remainingWork: 'Inspection and safety checklist signoff.',
    progressPercent: 95,
    status: 'Inspection',
    photos: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80'
    ],
    remarks: 'Requested inspection. Shuttering stiffness needs verification at the column junction.'
  },
  {
    id: 'CW-004',
    projectName: 'Sunrise Apartments Ph2',
    blockFloor: 'Block B / Floor 1',
    date: '2026-07-17',
    engineer: 'Arjun Sharma',
    supervisor: 'Vikram Patel',
    contractor: 'TN Roofing Solutions',
    workType: 'Lintel beam shuttering',
    area: '600 sq.ft',
    quantity: '30 wooden planks, 45 props',
    materialsUsed: 'Wooden planks, mild steel supports, nails',
    carpenters: 2,
    helpers: 3,
    todaysProgress: 'Unloaded materials and cleared the lintel height scaffolding path.',
    remainingWork: 'Erect scaffolding, place support planks and level them.',
    progressPercent: 10,
    status: 'Start Work',
    photos: [],
    remarks: 'Contractor assigned and started laying foundation planks today.'
  },
  {
    id: 'CW-005',
    projectName: 'Industrial Warehouse Block',
    blockFloor: 'Block C / Ground Floor',
    date: '2026-07-17',
    engineer: 'Kiran Reddy',
    supervisor: 'Ramu Selvam',
    contractor: 'Raj Constructions',
    workType: 'Roof Slab Shuttering',
    area: '4500 sq.ft',
    quantity: '150 plywood sheets, 250 props',
    materialsUsed: 'Plywood sheets, steel tubes, scaffolding coupler joints',
    carpenters: 0,
    helpers: 0,
    todaysProgress: 'Work order created in ERP.',
    remainingWork: 'Assigning contractor, transporting materials to the ground floor.',
    progressPercent: 0,
    status: 'Create',
    photos: [],
    remarks: 'Initial planning phase. Standard drawings received.'
  }
];

interface FormState {
  projectName: string;
  blockFloor: string;
  date: string;
  engineer: string;
  supervisor: string;
  contractor: string;
  workType: string;
  area: string;
  quantity: string;
  materialsUsed: string;
  carpenters: string;
  helpers: string;
  todaysProgress: string;
  remainingWork: string;
  progressPercent: string;
  status: WorkflowStatus;
  photos: string[];
  remarks: string;
}

const emptyForm: FormState = {
  projectName: '',
  blockFloor: '',
  date: '',
  engineer: '',
  supervisor: '',
  contractor: '',
  workType: '',
  area: '',
  quantity: '',
  materialsUsed: '',
  carpenters: '',
  helpers: '',
  todaysProgress: '',
  remainingWork: '',
  progressPercent: '0',
  status: 'Create',
  photos: [],
  remarks: '',
};

export default function CenteringWorkPage() {
  const [records, setRecords] = useState<CenteringWork[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [viewRecord, setViewRecord] = useState<CenteringWork | null>(null);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');

  // Load from localstorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CenteringWork[];
        if (parsed.length > 0) {
          setRecords(parsed);
          setHasLoaded(true);
          return;
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    // Seed with mock data
    setRecords(initialMockRecords);
    setHasLoaded(true);
  }, []);

  // Save to localstorage
  useEffect(() => {
    if (!hasLoaded || typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records, hasLoaded]);

  // Handle CRUD Form submission
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.projectName || !formData.blockFloor || !formData.date || !formData.engineer || !formData.supervisor || !formData.contractor) {
      alert('Please fill out all required fields marked with *');
      return;
    }

    const item: Omit<CenteringWork, 'id'> = {
      projectName: formData.projectName,
      blockFloor: formData.blockFloor,
      date: formData.date,
      engineer: formData.engineer,
      supervisor: formData.supervisor,
      contractor: formData.contractor,
      workType: formData.workType || 'General Shuttering',
      area: formData.area || '0 sq.ft',
      quantity: formData.quantity || '-',
      materialsUsed: formData.materialsUsed || '-',
      carpenters: Number(formData.carpenters) || 0,
      helpers: Number(formData.helpers) || 0,
      todaysProgress: formData.todaysProgress || '',
      remainingWork: formData.remainingWork || '',
      progressPercent: Number(formData.progressPercent) || 0,
      status: formData.status,
      photos: formData.photos,
      remarks: formData.remarks || '',
    };

    if (editingId) {
      setRecords((prev) =>
        prev.map((rec) => (rec.id === editingId ? { ...rec, ...item } : rec))
      );
      // Update details drawer too if currently viewed
      if (viewRecord && viewRecord.id === editingId) {
        setViewRecord({ ...item, id: editingId });
      }
    } else {
      const newRecord: CenteringWork = {
        ...item,
        id: `CW-${String(records.length + 1).padStart(3, '0')}-${Date.now().toString().slice(-4)}`,
      };
      setRecords((prev) => [newRecord, ...prev]);
    }

    setIsFormOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
    setCustomPhotoUrl('');
  };

  const openNewForm = () => {
    setEditingId(null);
    // Preset today's date in form
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      ...emptyForm,
      date: today,
    });
    setCustomPhotoUrl('');
    setIsFormOpen(true);
  };

  const openEditForm = (rec: CenteringWork) => {
    setEditingId(rec.id);
    setFormData({
      projectName: rec.projectName,
      blockFloor: rec.blockFloor,
      date: rec.date,
      engineer: rec.engineer,
      supervisor: rec.supervisor,
      contractor: rec.contractor,
      workType: rec.workType,
      area: rec.area,
      quantity: rec.quantity,
      materialsUsed: rec.materialsUsed,
      carpenters: rec.carpenters.toString(),
      helpers: rec.helpers.toString(),
      todaysProgress: rec.todaysProgress,
      remainingWork: rec.remainingWork,
      progressPercent: rec.progressPercent.toString(),
      status: rec.status,
      photos: rec.photos,
      remarks: rec.remarks,
    });
    setCustomPhotoUrl('');
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this centering work record?')) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      if (viewRecord?.id === id) {
        setViewRecord(null);
      }
    }
  };

  const handleQuickStatusAdvance = (rec: CenteringWork) => {
    const currentIndex = workflowSteps.indexOf(rec.status);
    if (currentIndex < workflowSteps.length - 1) {
      const nextStatus = workflowSteps[currentIndex + 1];
      let updatedProgress = rec.progressPercent;
      
      // Auto progress updates based on status transitions
      if (nextStatus === 'Completed') {
        updatedProgress = 100;
      } else if (nextStatus === 'Start Work' && rec.progressPercent === 0) {
        updatedProgress = 10;
      } else if (nextStatus === 'Inspection' && rec.progressPercent < 90) {
        updatedProgress = 95;
      }

      const updated = {
        ...rec,
        status: nextStatus,
        progressPercent: updatedProgress,
        remarks: `${rec.remarks ? rec.remarks + '\n' : ''}Workflow advanced to "${nextStatus}" on ${new Date().toLocaleDateString('en-IN')}.`
      };

      setRecords((prev) => prev.map((r) => (r.id === rec.id ? updated : r)));
      setViewRecord(updated);
    }
  };

  const handleQuickStatusRevert = (rec: CenteringWork) => {
    const currentIndex = workflowSteps.indexOf(rec.status);
    if (currentIndex > 0) {
      const prevStatus = workflowSteps[currentIndex - 1];
      const updated = {
        ...rec,
        status: prevStatus,
        remarks: `${rec.remarks ? rec.remarks + '\n' : ''}Workflow reverted to "${prevStatus}" on ${new Date().toLocaleDateString('en-IN')}.`
      };

      setRecords((prev) => prev.map((r) => (r.id === rec.id ? updated : r)));
      setViewRecord(updated);
    }
  };

  const addPhotoPreset = (url: string) => {
    if (!formData.photos.includes(url)) {
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, url],
      }));
    }
  };

  const addCustomPhoto = () => {
    if (customPhotoUrl && customPhotoUrl.trim().startsWith('http')) {
      if (!formData.photos.includes(customPhotoUrl.trim())) {
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, customPhotoUrl.trim()],
        }));
        setCustomPhotoUrl('');
      }
    } else {
      alert('Please enter a valid image URL starting with http:// or https://');
    }
  };

  const removePhoto = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p !== url),
    }));
  };

  // Filtered list
  const filteredRecords = records.filter((rec) => {
    const query = search.toLowerCase();
    const matchSearch =
      !query ||
      rec.projectName.toLowerCase().includes(query) ||
      rec.blockFloor.toLowerCase().includes(query) ||
      rec.workType.toLowerCase().includes(query) ||
      rec.contractor.toLowerCase().includes(query) ||
      rec.id.toLowerCase().includes(query);

    const matchFilter = filterStatus === 'All' || rec.status === filterStatus;
    return matchSearch && matchFilter;
  });

  // Calculate statistics
  const totalRecords = records.length;
  const activeRecords = records.filter((r) => r.status !== 'Completed' && r.status !== 'Create').length;
  const completedRecords = records.filter((r) => r.status === 'Completed').length;
  
  const avgProgress =
    records.length > 0
      ? Math.round(records.reduce((acc, r) => acc + r.progressPercent, 0) / records.length)
      : 0;

  // Active status indices for formatting progress trackers
  const getStatusIndex = (status: WorkflowStatus) => workflowSteps.indexOf(status);

  if (!hasLoaded) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">Loading module data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 page-fade-in pb-12">
      {/* Page Header */}
      <PageHeader
        title="Centering (Shuttering) Work"
        subtitle="Manage and track formwork progress, workforce logs, and inspections."
        icon={<HardHat className="text-orange-500" size={20} />}
        action={
          <button
            onClick={openNewForm}
            className="flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition-all shadow-md shadow-orange-500/25 active:scale-95"
          >
            <Plus size={16} /> New Work Order
          </button>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Tasks */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#1e293b] flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Work Orders</span>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{totalRecords}</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <Layers size={20} />
          </div>
        </div>

        {/* Average Progress */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#1e293b]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Avg. Shuttering Progress</span>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{avgProgress}%</div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Wrench size={20} />
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${avgProgress}%` }}></div>
          </div>
        </div>

        {/* Active Tasks */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#1e293b] flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Operations</span>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{activeRecords}</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Clock size={20} />
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#1e293b] flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Completed Shuttering</span>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{completedRecords}</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-950/40 flex items-center justify-center text-green-600 dark:text-green-400">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by Project, Type, Contractor..." />
        
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin scrollbar-thumb-slate-300">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0">Filter Status:</span>
          {['All', ...workflowSteps].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                filterStatus === status
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Records Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#1e293b] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-4">ID & Project</th>
                <th className="px-5 py-4">Block / Floor</th>
                <th className="px-5 py-4">Work Type</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Contractor</th>
                <th className="px-5 py-4">Progress</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <HardHat size={32} className="text-slate-300 dark:text-slate-700" />
                      <span className="font-semibold text-slate-500">No work orders found</span>
                      <p className="text-xs text-slate-400 max-w-xs">Try adjusting your filters or click "New Work Order" to create one.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-orange-600 dark:text-orange-400 text-xs tracking-wider">{rec.id}</div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{rec.projectName}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300 font-medium">
                      {rec.blockFloor}
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {rec.workType}
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(rec.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300 font-medium">
                      {rec.contractor}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 min-w-[90px]">
                        <div className="w-full bg-slate-100 dark:bg-slate-850 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              rec.progressPercent === 100 ? 'bg-green-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${rec.progressPercent}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">{rec.progressPercent}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[rec.status].bg} ${statusColors[rec.status].text} ${statusColors[rec.status].border}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewRecord(rec)}
                          title="View Details"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-orange-500 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-orange-200 dark:hover:border-orange-900/30 transition-all"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => openEditForm(rec)}
                          title="Edit"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-200 dark:hover:border-blue-900/30 transition-all"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(rec.id)}
                          title="Delete"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-200 dark:hover:border-red-900/30 transition-all"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED VIEW MODAL DRAWER */}
      {viewRecord && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-[#1e293b] h-full shadow-2xl overflow-y-auto flex flex-col page-fade-in animate-slide-in">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-[#1e293b]/95 backdrop-blur-xs z-10">
              <div>
                <span className="text-xs font-bold text-orange-500 tracking-widest uppercase">{viewRecord.id}</span>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{viewRecord.projectName}</h2>
              </div>
              <button
                onClick={() => setViewRecord(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 p-6 space-y-6">
              {/* Stepper Workflow Timeline */}
              <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 size={16} className="text-orange-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Workflow Tracker</span>
                </div>
                
                {/* Stepper Layout */}
                <div className="relative py-2">
                  <div className="absolute top-[21px] left-3 right-3 h-[2px] bg-slate-200 dark:bg-slate-800 z-0"></div>
                  
                  {/* Highlight completed steps bar */}
                  <div
                    className="absolute top-[21px] left-3 h-[2px] bg-green-500 z-0 transition-all duration-300"
                    style={{
                      width: `${(getStatusIndex(viewRecord.status) / (workflowSteps.length - 1)) * 96}%`,
                    }}
                  ></div>

                  <div className="flex justify-between items-start relative z-10">
                    {workflowSteps.map((step, idx) => {
                      const currentIdx = getStatusIndex(viewRecord.status);
                      const isCompleted = idx < currentIdx;
                      const isActive = idx === currentIdx;
                      
                      return (
                        <div key={step} className="flex flex-col items-center flex-1 text-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                              isCompleted
                                ? 'bg-green-500 border-green-500 text-white'
                                : isActive
                                ? 'bg-orange-500 border-orange-500 text-white ring-4 ring-orange-500/20'
                                : 'bg-white dark:bg-slate-900 border-slate-250 dark:border-slate-800 text-slate-400 dark:text-slate-600'
                            }`}
                          >
                            {isCompleted ? <Check size={14} /> : idx + 1}
                          </div>
                          <span
                            className={`text-[9px] font-semibold mt-2 max-w-[70px] leading-tight ${
                              isActive
                                ? 'text-orange-500 dark:text-orange-400 font-bold'
                                : isCompleted
                                ? 'text-slate-700 dark:text-slate-350'
                                : 'text-slate-400 dark:text-slate-600'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Workflow Transitions */}
                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current Phase: <strong className="text-slate-800 dark:text-slate-200">{viewRecord.status}</strong></span>
                  <div className="flex gap-2">
                    {getStatusIndex(viewRecord.status) > 0 && (
                      <button
                        onClick={() => handleQuickStatusRevert(viewRecord)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Revert State
                      </button>
                    )}
                    {getStatusIndex(viewRecord.status) < workflowSteps.length - 1 && (
                      <button
                        onClick={() => handleQuickStatusAdvance(viewRecord)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shadow-sm"
                      >
                        Advance State <ArrowRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Fields Grid */}
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Column 1: Location & Specs */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-850 pb-1">Location & Specification</h3>
                  
                  <div className="flex gap-3">
                    <MapPin className="text-slate-400 mt-0.5 shrink-0" size={16} />
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Block / Floor</div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{viewRecord.blockFloor}</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Calendar className="text-slate-400 mt-0.5 shrink-0" size={16} />
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Scheduled Date</div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {new Date(viewRecord.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Layers className="text-slate-400 mt-0.5 shrink-0" size={16} />
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Work Type & Coverage</div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{viewRecord.workType}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Area: {viewRecord.area}</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Wrench className="text-slate-400 mt-0.5 shrink-0" size={16} />
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Quantity / Formwork Setup</div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{viewRecord.quantity}</div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Stakeholders & Labor */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-850 pb-1">Assigned Personnel & Crew</h3>

                  <div className="flex gap-3">
                    <User className="text-slate-400 mt-0.5 shrink-0" size={16} />
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Civil Engineer In-Charge</div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{viewRecord.engineer}</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <User className="text-slate-400 mt-0.5 shrink-0" size={16} />
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Site Supervisor</div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{viewRecord.supervisor}</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Users className="text-slate-400 mt-0.5 shrink-0" size={16} />
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Centering Contractor</div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{viewRecord.contractor}</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Hammer className="text-slate-400 mt-0.5 shrink-0" size={16} />
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Workforce Crew Count</div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {viewRecord.carpenters} Carpenters & {viewRecord.helpers} Helpers
                      </div>
                      <div className="text-xs text-slate-500">Total strength: {viewRecord.carpenters + viewRecord.helpers} workers</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress and Materials Section */}
              <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-slate-550 uppercase tracking-wide">Work Execution Progress</span>
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{viewRecord.progressPercent}% Completed</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full transition-all duration-300" style={{ width: `${viewRecord.progressPercent}%` }}></div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 text-sm pt-2">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Today's Progression Logs</span>
                    <p className="text-slate-700 dark:text-slate-350 font-medium mt-1 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-250 dark:border-slate-800">
                      {viewRecord.todaysProgress || 'No logging recorded for today.'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Remaining Work Steps</span>
                    <p className="text-slate-700 dark:text-slate-350 font-medium mt-1 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-250 dark:border-slate-800">
                      {viewRecord.remainingWork || 'No pending tasks designated.'}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Materials Dispatched & Used</span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium text-sm mt-1">
                    {viewRecord.materialsUsed}
                  </p>
                </div>
              </div>

              {/* Photos Gallery */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-1">
                  <Image size={16} className="text-slate-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450">Uploaded Shuttering Photos</h3>
                </div>
                {viewRecord.photos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-slate-200 dark:border-slate-850 text-slate-400">
                    <Image size={24} className="text-slate-300 dark:text-slate-700 mb-1" />
                    <span className="text-xs">No photos attached to this work order.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {viewRecord.photos.map((url, i) => (
                      <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 group shadow-xs">
                        <img src={url} alt={`Site detail ${i + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity"
                        >
                          View Image
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Remarks Box */}
              {viewRecord.remarks && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-850 bg-amber-50/40 dark:bg-amber-950/10 p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wide">
                    <AlertCircle size={14} />
                    Observations / Remarks
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                    {viewRecord.remarks}
                  </p>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="border-t border-slate-200 dark:border-slate-800 p-6 flex justify-between bg-slate-50 dark:bg-[#1e293b] sticky bottom-0">
              <button
                onClick={() => {
                  setViewRecord(null);
                  openEditForm(viewRecord);
                }}
                className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Edit2 size={14} /> Edit Record
              </button>
              <button
                onClick={() => setViewRecord(null)}
                className="rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE & EDIT FORM MODAL OVERLAY */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden page-fade-in my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1e293b] shrink-0">
              <div className="flex items-center gap-2">
                <HardHat className="text-orange-500" size={20} />
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  {editingId ? `Edit Work Order: ${editingId}` : 'Create Centering Work Order'}
                </h2>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-250 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-650 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Primary details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide">
                  <span>Project Name *</span>
                  <select
                    required
                    value={formData.projectName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, projectName: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-slate-800 dark:text-slate-200 transition-all font-semibold"
                  >
                    <option value="">Select Project</option>
                    {projectsData.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide">
                  <span>Block / Floor *</span>
                  <input
                    required
                    value={formData.blockFloor}
                    onChange={(e) => setFormData((prev) => ({ ...prev, blockFloor: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-slate-800 dark:text-slate-200 transition-all font-medium"
                    placeholder="e.g. Block A / Floor 3"
                  />
                </label>

                <label className="block space-y-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide">
                  <span>Scheduled Date *</span>
                  <input
                    required
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-slate-800 dark:text-slate-200 transition-all font-medium"
                  />
                </label>

                <label className="block space-y-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide">
                  <span>Civil Engineer In-Charge *</span>
                  <select
                    required
                    value={formData.engineer}
                    onChange={(e) => setFormData((prev) => ({ ...prev, engineer: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-slate-800 dark:text-slate-200 transition-all font-medium"
                  >
                    <option value="">Select Civil Engineer</option>
                    {engineersData
                      .filter((e) => e.status === 'Active')
                      .map((e) => (
                        <option key={e.id} value={e.name}>
                          {e.name} ({e.designation})
                        </option>
                      ))}
                  </select>
                </label>

                <label className="block space-y-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide">
                  <span>Site Supervisor *</span>
                  <select
                    required
                    value={formData.supervisor}
                    onChange={(e) => setFormData((prev) => ({ ...prev, supervisor: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-slate-800 dark:text-slate-200 transition-all font-medium"
                  >
                    <option value="">Select Supervisor</option>
                    {supervisorsData.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide">
                  <span>Centering Contractor *</span>
                  <select
                    required
                    value={formData.contractor}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contractor: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-slate-800 dark:text-slate-200 transition-all font-medium"
                  >
                    <option value="">Select Contractor</option>
                    {contractorsData
                      .filter((c) => c.specialization.includes('Civil') || c.specialization.includes('Steel') || c.specialization.includes('Interior') || true)
                      .map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} ({c.specialization})
                        </option>
                      ))}
                  </select>
                </label>
              </div>

              {/* Shuttering Specs */}
              <div className="bg-slate-50 dark:bg-slate-900/35 p-4 rounded-xl border border-slate-150 dark:border-slate-850 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Wrench size={14} className="text-orange-500" /> Shuttering Details & Material Specifications
                </div>
                
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="block space-y-1 text-xs font-bold text-slate-500">
                    <span>Work Type *</span>
                    <input
                      required
                      value={formData.workType}
                      onChange={(e) => setFormData((prev) => ({ ...prev, workType: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:border-orange-500 text-slate-800 dark:text-slate-200 transition-all"
                      placeholder="e.g. Roof Slab Shuttering"
                    />
                  </label>

                  <label className="block space-y-1 text-xs font-bold text-slate-500">
                    <span>Target Area Coverage *</span>
                    <input
                      required
                      value={formData.area}
                      onChange={(e) => setFormData((prev) => ({ ...prev, area: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:border-orange-500 text-slate-800 dark:text-slate-200 transition-all"
                      placeholder="e.g. 1500 sq.ft"
                    />
                  </label>

                  <label className="block space-y-1 text-xs font-bold text-slate-500">
                    <span>Props & Sheets Quantity *</span>
                    <input
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:border-orange-500 text-slate-800 dark:text-slate-200 transition-all"
                      placeholder="e.g. 60 plywood sheets, 100 props"
                    />
                  </label>
                </div>

                <label className="block space-y-1 text-xs font-bold text-slate-500">
                  <span>Materials Used Description</span>
                  <input
                    value={formData.materialsUsed}
                    onChange={(e) => setFormData((prev) => ({ ...prev, materialsUsed: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:border-orange-500 text-slate-800 dark:text-slate-200 transition-all"
                    placeholder="e.g. Waterproof plywood, adjustable steel jacks, runners"
                  />
                </label>
              </div>

              {/* Labor count */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide">
                  <span>Carpenters Crew Count</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.carpenters}
                    onChange={(e) => setFormData((prev) => ({ ...prev, carpenters: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:border-orange-500 text-slate-800 dark:text-slate-200 transition-all font-medium"
                    placeholder="0"
                  />
                </label>

                <label className="block space-y-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide">
                  <span>Helpers Crew Count</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.helpers}
                    onChange={(e) => setFormData((prev) => ({ ...prev, helpers: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:border-orange-500 text-slate-800 dark:text-slate-200 transition-all font-medium"
                    placeholder="0"
                  />
                </label>
              </div>

              {/* Progress Tracker */}
              <div className="bg-slate-50 dark:bg-slate-900/35 p-4 rounded-xl border border-slate-150 dark:border-slate-850 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-orange-500" /> Current Execution Status & Progress
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide">
                    <span>Workflow Stage</span>
                    <select
                      value={formData.status}
                      onChange={(e) => {
                        const newStat = e.target.value as WorkflowStatus;
                        setFormData((prev) => {
                          let prog = prev.progressPercent;
                          if (newStat === 'Completed') prog = '100';
                          else if (newStat === 'Create' && prev.progressPercent === '100') prog = '0';
                          return { ...prev, status: newStat, progressPercent: prog };
                        });
                      }}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:border-orange-500 text-slate-800 dark:text-slate-200 font-semibold transition-all"
                    >
                      {workflowSteps.map((step) => (
                        <option key={step} value={step}>
                          {step}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-505 uppercase tracking-wide">
                      <span>Progress percentage ({formData.progressPercent}%)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.progressPercent}
                        onChange={(e) => setFormData((prev) => ({ ...prev, progressPercent: e.target.value }))}
                        className="w-full accent-orange-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full cursor-pointer"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.progressPercent}
                        onChange={(e) => setFormData((prev) => ({ ...prev, progressPercent: Math.min(100, Math.max(0, Number(e.target.value) || 0)).toString() }))}
                        className="w-16 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1 text-center text-xs font-bold text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-1 text-xs font-bold text-slate-500">
                    <span>Today's Progress Remarks</span>
                    <input
                      value={formData.todaysProgress}
                      onChange={(e) => setFormData((prev) => ({ ...prev, todaysProgress: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:border-orange-500 text-slate-800 dark:text-slate-200"
                      placeholder="e.g. Scaffolding finished, laid 40 plywood sheets"
                    />
                  </label>

                  <label className="block space-y-1 text-xs font-bold text-slate-500">
                    <span>Remaining Shuttering Tasks</span>
                    <input
                      value={formData.remainingWork}
                      onChange={(e) => setFormData((prev) => ({ ...prev, remainingWork: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:border-orange-500 text-slate-800 dark:text-slate-200"
                      placeholder="e.g. Finish edge shutter boards, apply release oil"
                    />
                  </label>
                </div>
              </div>

              {/* Photo Upload Simulation */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Image size={14} className="text-orange-500" /> Attachment Management (Photos)
                </div>

                {/* Preset Picker */}
                <div className="space-y-2 bg-slate-50 dark:bg-slate-900/30 p-3 rounded-lg border border-slate-200 dark:border-slate-800/80">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block">Select preset site images:</span>
                  <div className="flex flex-wrap gap-2.5">
                    {presetImages.map((url, i) => {
                      const isSelected = formData.photos.includes(url);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => (isSelected ? removePhoto(url) : addPhotoPreset(url))}
                          className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                            isSelected ? 'border-orange-500 scale-95 ring-2 ring-orange-500/20' : 'border-slate-200 dark:border-slate-800 hover:opacity-85'
                          }`}
                        >
                          <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                          {isSelected && (
                            <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                              <span className="bg-orange-500 text-white rounded-full p-0.5"><Check size={8} className="stroke-[4px]" /></span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom URL Input */}
                <div className="flex gap-2">
                  <input
                    value={customPhotoUrl}
                    onChange={(e) => setCustomPhotoUrl(e.target.value)}
                    placeholder="Or enter custom image URL starting with http://..."
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:border-orange-500 text-slate-800 dark:text-slate-200 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={addCustomPhoto}
                    className="rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 text-xs font-bold transition-all border border-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                  >
                    Add URL
                  </button>
                </div>

                {/* Thumbnails grid */}
                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 pt-1.5">
                    {formData.photos.map((url, idx) => (
                      <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 group">
                        <img src={url} alt={`Attached ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(url)}
                          className="absolute top-1 right-1 bg-black/75 text-white rounded-full p-1 hover:bg-red-650 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Remarks Area */}
              <label className="block space-y-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide">
                <span>Observations / Remarks</span>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData((prev) => ({ ...prev, remarks: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-slate-800 dark:text-slate-200 transition-all font-medium"
                  placeholder="Enter specific instructions, load capacities, level checking remarks, etc."
                />
              </label>

              {/* Form Actions */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-5 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 px-5 py-2 text-sm font-semibold text-white transition-all shadow-md shadow-orange-500/20"
                >
                  <Save size={14} /> {editingId ? 'Save Changes' : 'Submit Work Order'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
