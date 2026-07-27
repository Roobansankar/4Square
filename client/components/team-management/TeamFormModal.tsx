'use client';

import { useState, type FormEvent } from 'react';
import { Save } from 'lucide-react';
import Modal from './Modal';
import type { TeamStatus } from '@/types/team';

interface TeamFormModalProps {
  onSave: (data: { name: string; project: string; leader: string; status: TeamStatus }) => void;
  onCancel: () => void;
}

export default function TeamFormModal({ onSave, onCancel }: TeamFormModalProps) {
  const [name, setName] = useState('');
  const [project, setProject] = useState('');
  const [leader, setLeader] = useState('');
  const [status, setStatus] = useState<TeamStatus>('Active');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !project.trim() || !leader.trim()) {
      setError('Team name, project, and leader are required');
      return;
    }
    onSave({ name: name.trim(), project: project.trim(), leader: leader.trim(), status });
  };

  return (
    <Modal title="Create Team" subtitle="Set up a new construction team" onClose={onCancel} width="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-medium">Team Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Team D" className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Project</label>
          <input value={project} onChange={(e) => setProject(e.target.value)} placeholder="Assigned project" className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Team Leader</label>
          <input value={leader} onChange={(e) => setLeader(e.target.value)} placeholder="e.g. Civil Engineer Arun" className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as TeamStatus)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onCancel} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm">Cancel</button>
          <button type="submit" className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
            <Save size={16} /> Create Team
          </button>
        </div>
      </form>
    </Modal>
  );
}
