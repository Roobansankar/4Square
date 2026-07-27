'use client';

import { useEffect, useMemo, useState } from 'react';
import { Users, Plus, Eye, Edit2, Trash2, Search, Download, Printer, CheckCircle2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import ClientForm, { type ClientRecord } from '@/components/clients/ClientForm';

const STORAGE_KEY = '4square-clients';
const pageSize = 6;

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

export default function ClientsPage() {
  const [records, setRecords] = useState<ClientRecord[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ClientRecord | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ClientRecord | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setRecords(JSON.parse(stored) as ClientRecord[]);
    } else {
      setRecords([
        {
          id: 'client-sample-1',
          client_code: 'CL-20260716-101',
          client_name: 'Aarav Group',
          company_name: 'Aarav Group Pvt Ltd',
          client_type: 'Company',
          mobile: '9876543210',
          email: 'rohan@aaravgroup.com',
          address: '12, MG Road, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
          gst_number: '29ABCDE1234F1Z5',
          status: 'Confirmed',
          remarks: 'Premium client',
          created_at: '2026-07-16',
          updated_at: '2026-07-16',
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
  }, [records]);

  const filteredRecords = useMemo(() => {
    const query = search.toLowerCase();
    return records.filter((record) => {
      const matchesSearch = !query || [record.client_code, record.client_name, record.company_name, record.city, record.email, record.mobile].some((field) => field.toLowerCase().includes(query));
      const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const pageRecords = filteredRecords.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleSave = (record: ClientRecord) => {
    if (editingRecord) {
      setRecords((prev) => prev.map((item) => item.id === record.id ? record : item));
    } else {
      setRecords((prev) => [record, ...prev]);
    }
    setIsEditorOpen(false);
    setEditingRecord(null);
    setSelectedRecord(record);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this client?')) {
      setRecords((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleApprove = (id: string) => {
    setRecords((prev) => prev.map((item) => item.id === id ? { ...item, status: 'Confirmed', updated_at: new Date().toISOString().slice(0, 10) } : item));
  };

  const exportPdf = (record: ClientRecord) => {
    const content = `Client Profile\nCode: ${record.client_code}\nName: ${record.client_name}\nCompany: ${record.company_name}\nPhone: ${record.mobile}\nEmail: ${record.email}\nStatus: ${record.status}`;
    downloadFile(content, `${record.client_code}.txt`, 'text/plain;charset=utf-8;');
  };

  const exportExcel = (record: ClientRecord) => {
    const rows = [['Client Code', record.client_code], ['Client Name', record.client_name], ['Company', record.company_name], ['Phone', record.mobile], ['Email', record.email], ['Status', record.status]];
    downloadFile(rows.map((row) => row.join(',')).join('\n'), `${record.client_code}.csv`, 'text/csv;charset=utf-8;');
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Clients" subtitle="Simple client management using the requested database fields" icon={<Users size={18} />} action={<button onClick={() => { setEditingRecord(null); setSelectedRecord(null); setIsEditorOpen(true); }} className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white"><Plus size={16} /> Add Client</button>} />

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search by code, name, company, city, or phone" className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] pl-9 pr-3 py-2 text-sm" />
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', 'Lead', 'Active', 'Inactive', 'Confirmed'].map((status) => (
            <button key={status} onClick={() => { setStatusFilter(status); setPage(1); }} className={`rounded-lg px-3 py-2 text-xs font-semibold ${statusFilter === status ? 'bg-orange-500 text-white' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>{status}</button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"><p className="text-sm text-[var(--muted-foreground)]">Total Clients</p><p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">{records.length}</p></div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"><p className="text-sm text-[var(--muted-foreground)]">Active</p><p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">{records.filter((item) => item.status === 'Active' || item.status === 'Confirmed').length}</p></div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"><p className="text-sm text-[var(--muted-foreground)]">Leads</p><p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">{records.filter((item) => item.status === 'Lead').length}</p></div>
      </div>

      {!isEditorOpen ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--muted)]">
                <tr>
                  {['Client Code', 'Client Name', 'Company', 'Phone', 'Status', 'Actions'].map((header) => <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">{header}</th>)}
                </tr>
              </thead>
              <tbody>
                {pageRecords.map((record) => (
                  <tr key={record.id} className="border-t border-[var(--border)]">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-orange-600">{record.client_code}</td>
                    <td className="px-4 py-3">{record.client_name}</td>
                    <td className="px-4 py-3">{record.company_name}</td>
                    <td className="px-4 py-3">{record.mobile}</td>
                    <td className="px-4 py-3"><span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700">{record.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <button onClick={() => setSelectedRecord(record)} className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-100"><Eye size={13} /></button>
                        <button onClick={() => { setEditingRecord(record); setIsEditorOpen(true); }} className="rounded-lg p-1.5 text-orange-600 hover:bg-orange-100"><Edit2 size={13} /></button>
                        <button onClick={() => handleApprove(record.id)} className="rounded-lg p-1.5 text-green-600 hover:bg-green-100"><CheckCircle2 size={13} /></button>
                        <button onClick={() => handleDelete(record.id)} className="rounded-lg p-1.5 text-red-600 hover:bg-red-100"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-3 text-xs text-[var(--muted-foreground)]">
            <span>Showing {pageRecords.length} of {filteredRecords.length} clients</span>
            <div className="flex gap-2">
              <button onClick={() => setPage((prev) => Math.max(1, prev - 1))} className="rounded-lg border border-[var(--border)] px-3 py-1">Prev</button>
              <span className="rounded-lg bg-orange-500 px-3 py-1 text-white">{page}</span>
              <button onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} className="rounded-lg border border-[var(--border)] px-3 py-1">Next</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">{editingRecord ? 'Edit Client' : 'Create Client'}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Capture the client information using the requested master fields only.</p>
            </div>
            <button onClick={() => { setIsEditorOpen(false); setEditingRecord(null); }} className="rounded-lg border border-[var(--border)] p-2">×</button>
          </div>
          <ClientForm initialData={editingRecord} onSave={handleSave} onCancel={() => { setIsEditorOpen(false); setEditingRecord(null); }} />
        </div>
      )}

      {selectedRecord && !isEditorOpen && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">{selectedRecord.client_name}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">{selectedRecord.client_code} · {selectedRecord.company_name}</p>
            </div>
            <button onClick={() => setSelectedRecord(null)} className="rounded-lg border border-[var(--border)] p-2">×</button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[var(--border)] p-4">
              <p className="text-sm font-semibold">Contact</p>
              <div className="mt-2 space-y-1 text-sm text-[var(--muted-foreground)]">
                <p>Phone: {selectedRecord.mobile}</p>
                <p>Email: {selectedRecord.email}</p>
                <p>City: {selectedRecord.city}</p>
                <p>Status: {selectedRecord.status}</p>
              </div>
            </div>
            <div className="rounded-xl border border-[var(--border)] p-4">
              <p className="text-sm font-semibold">Address</p>
              <div className="mt-2 space-y-1 text-sm text-[var(--muted-foreground)]">
                <p>{selectedRecord.address}</p>
                <p>{selectedRecord.city}, {selectedRecord.state} - {selectedRecord.pincode}</p>
                <p>GST: {selectedRecord.gst_number}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => exportPdf(selectedRecord)} className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm"><Download size={15} /> Export PDF</button>
            <button onClick={() => exportExcel(selectedRecord)} className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm"><Download size={15} /> Export Excel</button>
            <button onClick={() => window.print()} className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm"><Printer size={15} /> Print</button>
          </div>
        </div>
      )}
    </div>
  );
}
