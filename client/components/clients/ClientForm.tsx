'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Save, X } from 'lucide-react';

export interface ClientRecord {
  id: string;
  client_code: string;
  client_name: string;
  company_name: string;
  client_type: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gst_number: string;
  status: string;
  remarks: string;
  created_at: string;
  updated_at: string;
}

interface ClientFormProps {
  initialData?: ClientRecord | null;
  onSave: (record: ClientRecord) => void;
  onCancel: () => void;
}

const STORAGE_KEY = '4square-clients';
const clientTypes = ['Individual', 'Company', 'Government', 'Builder', 'Corporate'];
const statusOptions = ['Lead', 'Active', 'Inactive', 'Confirmed'];

function generateClientCode() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `CL-${date}-${Math.floor(Math.random() * 900 + 100)}`;
}

function createEmptyRecord(existing: ClientRecord[]): ClientRecord {
  const existingCodes = existing.map((item) => item.client_code);
  let clientCode = generateClientCode();
  while (existingCodes.includes(clientCode)) {
    clientCode = generateClientCode();
  }

  return {
    id: '',
    client_code: clientCode,
    client_name: '',
    company_name: '',
    client_type: 'Individual',
    mobile: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gst_number: '',
    status: 'Lead',
    remarks: '',
    created_at: new Date().toISOString().slice(0, 10),
    updated_at: new Date().toISOString().slice(0, 10),
  };
}

export default function ClientForm({ initialData, onSave, onCancel }: ClientFormProps) {
  const [formData, setFormData] = useState<ClientRecord>(() => createEmptyRecord([]));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const records = JSON.parse(stored) as ClientRecord[];
        setFormData(createEmptyRecord(records));
      }
    }
  }, [initialData]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.client_name.trim()) nextErrors.client_name = 'Client name is required';
    if (!formData.mobile.trim()) nextErrors.mobile = 'Mobile number is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) nextErrors.email = 'Provide a valid email';
    if (!formData.address.trim() && !formData.city.trim() && !formData.state.trim()) {
      nextErrors.address = 'Address, city, or state is required';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const updateField = (field: keyof ClientRecord, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    const payload: ClientRecord = {
      ...formData,
      id: formData.id || `client-${Date.now()}`,
      updated_at: new Date().toISOString().slice(0, 10),
      created_at: formData.created_at || new Date().toISOString().slice(0, 10),
    };

    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-[var(--border)] p-4 space-y-4">
        <h3 className="font-semibold text-[var(--foreground)]">Client Details</h3>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Client Code</label>
            <input value={formData.client_code} readOnly className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Client Type</label>
            <select value={formData.client_type} onChange={(event) => updateField('client_type', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm">
              {clientTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Client Name</label>
            <input value={formData.client_name} onChange={(event) => updateField('client_name', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
            <p className="text-xs text-red-500">{errors.client_name}</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Company Name</label>
            <input value={formData.company_name} onChange={(event) => updateField('company_name', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Mobile</label>
            <input value={formData.mobile} onChange={(event) => updateField('mobile', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
            <p className="text-xs text-red-500">{errors.mobile}</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input value={formData.email} onChange={(event) => updateField('email', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
            <p className="text-xs text-red-500">{errors.email}</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Address</label>
            <input value={formData.address} onChange={(event) => updateField('address', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">City</label>
            <input value={formData.city} onChange={(event) => updateField('city', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">State</label>
            <input value={formData.state} onChange={(event) => updateField('state', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Pincode</label>
            <input value={formData.pincode} onChange={(event) => updateField('pincode', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">GST Number</label>
            <input value={formData.gst_number} onChange={(event) => updateField('gst_number', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Status</label>
            <select value={formData.status} onChange={(event) => updateField('status', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm">
              {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
          <div className="space-y-1 md:col-span-2 xl:col-span-3">
            <label className="text-sm font-medium">Remarks</label>
            <textarea value={formData.remarks} onChange={(event) => updateField('remarks', event.target.value)} rows={3} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          </div>
        </div>
        <p className="text-xs text-red-500">{errors.address}</p>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm">
          <X size={16} /> Cancel
        </button>
        <button type="submit" className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
          <Save size={16} /> Save Client
        </button>
      </div>
    </form>
  );
}
