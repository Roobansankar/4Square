'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { ClipboardList, Save, Upload } from 'lucide-react';

interface SiteProgressFormState {
  projectName: string;
  date: string;
  siteEngineer: string;
  supervisor: string;
  workCategory: string;
  workDescription: string;
  plannedQuantity: string;
  completedQuantity: string;
  remainingQuantity: string;
  totalLabour: string;
  workingHours: string;
  materialUsed: string;
  materialQuantity: string;
  siteStatus: string;
  remarks: string;
}

const initialState: SiteProgressFormState = {
  projectName: '',
  date: '',
  siteEngineer: '',
  supervisor: '',
  workCategory: '',
  workDescription: '',
  plannedQuantity: '',
  completedQuantity: '',
  remainingQuantity: '',
  totalLabour: '',
  workingHours: '',
  materialUsed: '',
  materialQuantity: '',
  siteStatus: '',
  remarks: '',
};

export default function Page() {
  const [form, setForm] = useState(initialState);

  const handleChange = (field: keyof SiteProgressFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Site progress submitted:', form);
  };

  const resetForm = () => {
    setForm(initialState);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Site Progress"
        subtitle="Daily work progress entry form"
        icon={<ClipboardList size={18} />}
      />

      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Project Name *</span>
            <input
              required
              value={form.projectName}
              onChange={(event) => handleChange('projectName', event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
              placeholder="Enter project name"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Date *</span>
            <input
              required
              type="date"
              value={form.date}
              onChange={(event) => handleChange('date', event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Site Engineer *</span>
            <input
              required
              value={form.siteEngineer}
              onChange={(event) => handleChange('siteEngineer', event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
              placeholder="Enter site engineer name"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Supervisor *</span>
            <input
              required
              value={form.supervisor}
              onChange={(event) => handleChange('supervisor', event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
              placeholder="Enter supervisor name"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Work Category *</span>
            <input
              required
              value={form.workCategory}
              onChange={(event) => handleChange('workCategory', event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
              placeholder="Enter work category"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Work Description *</span>
            <input
              required
              value={form.workDescription}
              onChange={(event) => handleChange('workDescription', event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
              placeholder="Enter work description"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Planned Quantity *</span>
            <input
              required
              value={form.plannedQuantity}
              onChange={(event) => handleChange('plannedQuantity', event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
              placeholder="Enter planned quantity"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Completed Quantity *</span>
            <input
              required
              value={form.completedQuantity}
              onChange={(event) => handleChange('completedQuantity', event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
              placeholder="Enter completed quantity"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Remaining Quantity</span>
            <input
              value={form.remainingQuantity}
              onChange={(event) => handleChange('remainingQuantity', event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
              placeholder="Enter remaining quantity"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Total Labour</span>
            <input
              value={form.totalLabour}
              onChange={(event) => handleChange('totalLabour', event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
              placeholder="Enter total labour"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Working Hours</span>
            <input
              value={form.workingHours}
              onChange={(event) => handleChange('workingHours', event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
              placeholder="Enter working hours"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Material Used</span>
            <input
              value={form.materialUsed}
              onChange={(event) => handleChange('materialUsed', event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
              placeholder="Enter material used"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Material Quantity</span>
            <input
              value={form.materialQuantity}
              onChange={(event) => handleChange('materialQuantity', event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
              placeholder="Enter material quantity"
            />
          </label>
        </div>

        <label className="block space-y-2 text-sm font-medium text-slate-700">
          <span>Site Status</span>
          <select
            value={form.siteStatus}
            onChange={(event) => handleChange('siteStatus', event.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
          >
            <option value="">Select status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Delayed">Delayed</option>
          </select>
        </label>

        <label className="block space-y-2 text-sm font-medium text-slate-700">
          <span>Upload Photos</span>
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-500">
            <Upload size={16} className="text-orange-500" />
            <input type="file" multiple className="w-full" />
          </div>
        </label>

        <label className="block space-y-2 text-sm font-medium text-slate-700">
          <span>Remarks</span>
          <textarea
            value={form.remarks}
            onChange={(event) => handleChange('remarks', event.target.value)}
            rows={4}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
            placeholder="Enter remarks"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={resetForm}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            <Save size={16} /> Save
          </button>
          <button
            type="submit"
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
