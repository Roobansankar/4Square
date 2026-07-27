'use client';
import { Search } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search...' }: Props) {
  return (
    <div className="flex items-center gap-2 bg-[var(--muted)] rounded-xl px-3 py-2 w-full max-w-xs">
      <Search size={15} className="text-[var(--muted-foreground)] shrink-0" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent text-sm outline-none w-full text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
      />
    </div>
  );
}
