'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  width?: string;
}

export default function Modal({ title, subtitle, onClose, children, width = 'max-w-2xl' }: ModalProps) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className={`w-full ${width} max-h-[90vh] overflow-y-auto rounded-xl bg-[var(--card)] p-5 sm:p-6 shadow-xl`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
            {subtitle && <p className="text-sm text-[var(--muted-foreground)] mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="rounded-lg border border-[var(--border)] p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--muted)] shrink-0">
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
