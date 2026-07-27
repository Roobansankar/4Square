'use client';

import { useEffect, useState } from 'react';
import { Building2, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import vendorsData from '@/data/vendors.json';

interface VendorRecord {
  id: string;
  vendorName: string;
  gstNumber: string;
  contactNumber: string;
  additionalNumber: string;
  address: string;
  state: string;
  country: string;
  category: 'Electrical' | 'Plumbing' | 'Painter' | 'Extra';
}

const STORAGE_KEY = '4square-vendors';

const emptyForm = {
  vendorName: '',
  gstNumber: '',
  contactNumber: '',
  additionalNumber: '',
  address: '',
  state: '',
  country: '',
  category: 'Electrical' as VendorRecord['category'],
};

export default function VendorsPage() {
  const [search, setSearch] = useState('');
  const [vendors, setVendors] = useState<VendorRecord[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setVendors(JSON.parse(stored) as VendorRecord[]);
      } else {
        const initial: VendorRecord[] = (vendorsData as Array<Record<string, unknown>>).map((vendor, index) => ({
          id: String(vendor.id ?? `VEN-${index + 1}`),
          vendorName: String(vendor.vendor ?? 'Vendor'),
          gstNumber: String(vendor.gst ?? ''),
          contactNumber: String(vendor.phone ?? ''),
          additionalNumber: '',
          address: '',
          state: '',
          country: 'India',
          category: 'Electrical',
        }));
        setVendors(initial);
      }
    } catch {
      setVendors([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(vendors));
  }, [vendors]);

  const filtered = vendors.filter((vendor) => {
    const query = search.toLowerCase();
    return !query || vendor.vendorName.toLowerCase().includes(query) || vendor.category.toLowerCase().includes(query) || vendor.gstNumber.toLowerCase().includes(query);
  });

  const openNewForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  const openEditForm = (vendor: VendorRecord) => {
    setEditingId(vendor.id);
    setFormData({ ...vendor });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this vendor?')) {
      setVendors((prev) => prev.filter((vendor) => vendor.id !== id));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: VendorRecord = {
      id: editingId || `VEN-${Date.now()}`,
      vendorName: formData.vendorName.trim(),
      gstNumber: formData.gstNumber.trim(),
      contactNumber: formData.contactNumber.trim(),
      additionalNumber: formData.additionalNumber.trim(),
      address: formData.address.trim(),
      state: formData.state.trim(),
      country: formData.country.trim() || 'India',
      category: formData.category,
    };

    if (!payload.vendorName || !payload.contactNumber) {
      window.alert('Please enter the vendor name and contact number.');
      return;
    }

    if (editingId) {
      setVendors((prev) => prev.map((vendor) => (vendor.id === editingId ? payload : vendor)));
    } else {
      setVendors((prev) => [payload, ...prev]);
    }

    setIsFormOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Vendors" subtitle={`${vendors.length} vendors`} icon={<Building2 size={18} />}
        action={<button onClick={openNewForm} className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"><Plus size={16} />Add Vendor</button>} />

      <SearchBar value={search} onChange={setSearch} placeholder="Search vendors..." />

      {isFormOpen && (
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">{editingId ? 'Edit Vendor' : 'Add Vendor'}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Store vendor contact and registration details.</p>
            </div>
            <button onClick={() => setIsFormOpen(false)} className="p-2 rounded-lg hover:bg-[var(--muted)]">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Vendor name</label>
              <input value={formData.vendorName} onChange={(event) => setFormData((prev) => ({ ...prev, vendorName: event.target.value }))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" placeholder="Vendor name" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">GST number</label>
              <input value={formData.gstNumber} onChange={(event) => setFormData((prev) => ({ ...prev, gstNumber: event.target.value }))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" placeholder="GST number" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Contact number</label>
              <input value={formData.contactNumber} onChange={(event) => setFormData((prev) => ({ ...prev, contactNumber: event.target.value }))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" placeholder="Primary contact" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Additional number</label>
              <input value={formData.additionalNumber} onChange={(event) => setFormData((prev) => ({ ...prev, additionalNumber: event.target.value }))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" placeholder="Secondary contact" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium">Address</label>
              <textarea value={formData.address} onChange={(event) => setFormData((prev) => ({ ...prev, address: event.target.value }))} rows={2} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" placeholder="Vendor address" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">State</label>
              <input value={formData.state} onChange={(event) => setFormData((prev) => ({ ...prev, state: event.target.value }))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" placeholder="State" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Country</label>
              <input value={formData.country} onChange={(event) => setFormData((prev) => ({ ...prev, country: event.target.value }))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" placeholder="Country" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Category</label>
              <select value={formData.category} onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value as VendorRecord['category'] }))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm">
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Painter">Painter</option>
                <option value="Extra">Extra</option>
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium">Cancel</button>
              <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold">
                <Save size={16} /> {editingId ? 'Update Vendor' : 'Save Vendor'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--muted)] border-b border-[var(--border)]">
              <tr>{['Vendor Name', 'GST Number', 'Contact', 'Category', 'Address', 'Actions'].map((header) => <th key={header} className="text-left text-xs font-semibold text-[var(--muted-foreground)] px-4 py-3 whitespace-nowrap">{header}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map((vendor) => (
                <tr key={vendor.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--accent)] transition-colors">
                  <td className="px-4 py-3"><div className="font-medium text-sm text-[var(--foreground)]">{vendor.vendorName}</div></td>
                  <td className="px-4 py-3 text-xs font-mono text-[var(--muted-foreground)]">{vendor.gstNumber || '—'}</td>
                  <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">{vendor.contactNumber}{vendor.additionalNumber ? ` / ${vendor.additionalNumber}` : ''}</td>
                  <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">{vendor.category}</td>
                  <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">{vendor.address || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEditForm(vendor)} className="p-1.5 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-600 transition-colors"><Edit2 size={13} /></button>
                      <button onClick={() => handleDelete(vendor.id)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
