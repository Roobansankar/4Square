'use client';

import { useState, type FormEvent } from 'react';
import { Save } from 'lucide-react';
import Modal from './Modal';
import { STAFF_CATEGORIES, type MemberStatus, type StaffCategory, type TeamMember } from '@/types/team';

interface MemberFormModalProps {
  initialData?: TeamMember | null;
  initialCategory: StaffCategory;
  lockCategory?: boolean;
  defaultSite: string;
  onSave: (category: StaffCategory, member: TeamMember) => void;
  onCancel: () => void;
}

export default function MemberFormModal({ initialData, initialCategory, lockCategory, defaultSite, onSave, onCancel }: MemberFormModalProps) {
  const [category, setCategory] = useState<StaffCategory>(initialCategory);
  const [name, setName] = useState(initialData?.name ?? '');
  const [role, setRole] = useState(initialData?.role ?? '');
  const [phone, setPhone] = useState(initialData?.phone ?? '');
  const [experience, setExperience] = useState(initialData?.experience ?? '');
  const [dailyWage, setDailyWage] = useState(initialData?.dailyWage ?? 0);
  const [joiningDate, setJoiningDate] = useState(initialData?.joiningDate ?? new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<MemberStatus>(initialData?.status ?? 'Active');
  const [assignedSite, setAssignedSite] = useState(initialData?.assignedSite ?? defaultSite);
  const [currentTask, setCurrentTask] = useState(initialData?.currentTask ?? '');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !role.trim() || !phone.trim()) {
      setError('Name, role, and phone are required');
      return;
    }

    onSave(category, {
      id: initialData?.id || `mem-${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      phone: phone.trim(),
      experience: experience.trim() || '—',
      dailyWage: Number(dailyWage) || 0,
      joiningDate,
      status,
      assignedSite: assignedSite.trim() || defaultSite,
      currentTask: currentTask.trim(),
    });
  };

  return (
    <Modal title={initialData ? 'Edit Member' : 'Add Member'} subtitle={category} onClose={onCancel} width="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Category</label>
            <select
              value={category}
              disabled={lockCategory}
              onChange={(e) => setCategory(e.target.value as StaffCategory)}
              className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm disabled:opacity-60"
            >
              {STAFF_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Role</label>
            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Mason" className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Phone Number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Experience</label>
            <input value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g. 5 years" className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Daily Wage (INR)</label>
            <input type="number" min={0} value={dailyWage} onChange={(e) => setDailyWage(Number(e.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Joining Date</label>
            <input type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as MemberStatus)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm">
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Assigned Site</label>
            <input value={assignedSite} onChange={(e) => setAssignedSite(e.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <label className="text-sm font-medium">Current Task</label>
            <input value={currentTask} onChange={(e) => setCurrentTask(e.target.value)} placeholder="What are they working on right now" className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          </div>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onCancel} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm">Cancel</button>
          <button type="submit" className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
            <Save size={16} /> {initialData ? 'Update Member' : 'Add Member'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
