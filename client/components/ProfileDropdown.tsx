'use client';

import { useRouter } from 'next/navigation';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';

export default function ProfileDropdown() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('auth');
    router.push('/login');
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[var(--muted)] transition-colors">
        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
          AD
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-xs font-semibold text-[var(--foreground)]">Admin</div>
          <div className="text-[10px] text-[var(--muted-foreground)]">4 Square Architects</div>
        </div>
        <ChevronDown size={14} className="text-[var(--muted-foreground)] hidden sm:block" />
      </button>

      <div className="absolute right-0 top-full mt-2 w-52 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xl z-50 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <div className="font-semibold text-sm text-[var(--foreground)]">Admin User</div>
          <div className="text-xs text-[var(--muted-foreground)]">admin@4square.com</div>
          <div className="text-xs text-orange-500 font-medium mt-0.5">4 Square Architects</div>
        </div>
        <div className="py-1">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
            <User size={15} className="text-[var(--muted-foreground)]" />Profile
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
            <Settings size={15} className="text-[var(--muted-foreground)]" />Settings
          </button>
          <div className="border-t border-[var(--border)] my-1" />
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <LogOut size={15} />Logout
          </button>
        </div>
      </div>
    </div>
  );
}
