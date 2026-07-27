'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, X } from 'lucide-react';

const clientSchema = z.object({
  client_code: z.string().min(1, 'Client code is required'),
  client_name: z.string().min(1, 'Client name is required'),
  client_type: z.enum(['Individual', 'Company']),
  company_name: z.string().optional(),
  mobile: z.string().min(1, 'Mobile number is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  project_name: z.string().optional(),
  project_type: z.string().optional(),
  budget: z.string().optional(),
  gst_number: z.string().optional(),
  advance_amount: z.string().optional(),
  status: z.enum(['Lead', 'Quotation', 'Running', 'Completed']),
  remarks: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;

interface ClientManagementFormProps {
  defaultValues?: Partial<ClientFormValues>;
  onSubmit: (values: ClientFormValues) => void;
  onCancel: () => void;
}

export default function ClientManagementForm({ defaultValues, onSubmit, onCancel }: ClientManagementFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Client Code</label>
          <input {...register('client_code')} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          {errors.client_code && <p className="mt-1 text-xs text-red-500">{errors.client_code.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Client Name</label>
          <input {...register('client_name')} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          {errors.client_name && <p className="mt-1 text-xs text-red-500">{errors.client_name.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Client Type</label>
          <select {...register('client_type')} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="Individual">Individual</option>
            <option value="Company">Company</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Company Name</label>
          <input {...register('company_name')} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Mobile</label>
          <input {...register('mobile')} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input {...register('email')} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Address</label>
          <input {...register('address')} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">City</label>
          <input {...register('city')} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">State</label>
          <input {...register('state')} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Pincode</label>
          <input {...register('pincode')} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Project Name</label>
          <input {...register('project_name')} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Project Type</label>
          <input {...register('project_type')} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Budget</label>
          <input {...register('budget')} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">GST Number</label>
          <input {...register('gst_number')} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Advance Amount</label>
          <input {...register('advance_amount')} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>
          <select {...register('status')} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="Lead">Lead</option>
            <option value="Quotation">Quotation</option>
            <option value="Running">Running</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Remarks</label>
        <textarea {...register('remarks')} rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm">
          <X size={16} /> Cancel
        </button>
        <button type="submit" className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
          <Save size={16} /> Save Client
        </button>
      </div>
    </form>
  );
}
