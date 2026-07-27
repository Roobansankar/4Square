'use client';
import { Settings, Building2, Bell, Shield, Palette, Users } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

const sections = [
  {
    icon: <Building2 size={18} className="text-orange-500" />,
    title: 'Company Profile',
    desc: 'Update company name, logo, address and contact details',
    fields: [
      { label: 'Company Name', value: '4 Square Architects', type: 'text' },
      { label: 'Email', value: 'info@4square.com', type: 'email' },
      { label: 'Phone', value: '+91 98765 43210', type: 'tel' },
      { label: 'Address', value: 'Coimbatore, Tamil Nadu', type: 'text' },
    ]
  },
  {
    icon: <Bell size={18} className="text-blue-500" />,
    title: 'Notifications',
    desc: 'Configure how and when you receive alerts',
    toggles: ['Email notifications', 'SMS alerts', 'Browser push notifications', 'Daily report digest']
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage your ERP preferences" icon={<Settings size={18} />} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          {[
            { icon: <Building2 size={16} />, label: 'Company Profile' },
            { icon: <Bell size={16} />, label: 'Notifications' },
            { icon: <Shield size={16} />, label: 'Security' },
            { icon: <Palette size={16} />, label: 'Appearance' },
            { icon: <Users size={16} />, label: 'Users & Roles' },
          ].map((item, i) => (
            <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${i === 0 ? 'bg-orange-500 text-white' : 'text-[var(--foreground)] hover:bg-[var(--muted)]'}`}>
              {item.icon}{item.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] p-6">
            <h3 className="font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2"><Building2 size={16} className="text-orange-500" />Company Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sections[0].fields!.map((f, i) => (
                <div key={i}>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-1.5 block">{f.label}</label>
                  <input type={f.type} defaultValue={f.value}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] text-sm outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" />
                </div>
              ))}
            </div>
            <button className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors">Save Changes</button>
          </div>

          <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] p-6">
            <h3 className="font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2"><Bell size={16} className="text-blue-500" />Notifications</h3>
            <div className="space-y-3">
              {sections[1].toggles!.map((t, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                  <span className="text-sm text-[var(--foreground)]">{t}</span>
                  <button className={`relative w-10 h-5 rounded-full transition-colors ${i < 2 ? 'bg-orange-500' : 'bg-[var(--muted)]'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${i < 2 ? 'left-5.5 translate-x-0.5' : 'left-0.5'}`} style={{ transform: i < 2 ? 'translateX(20px)' : 'translateX(0)' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
