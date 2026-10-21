import React from 'react';
import type { StudentStatus } from '@/src/services/students/students.types';

interface StudentStatusBadgeProps {
  status: StudentStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<
  StudentStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  active: {
    label: 'Active',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  prospect: {
    label: 'Prospect',
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  suspended: {
    label: 'Suspended',
    bg: 'bg-rose-500/10 dark:bg-rose-500/15',
    text: 'text-rose-700 dark:text-rose-400',
    dot: 'bg-rose-500',
  },
  graduated: {
    label: 'Graduated',
    bg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
    text: 'text-indigo-700 dark:text-indigo-400',
    dot: 'bg-indigo-500',
  },
  withdrawn: {
    label: 'Withdrawn',
    bg: 'bg-slate-500/10 dark:bg-slate-500/15',
    text: 'text-slate-600 dark:text-slate-400',
    dot: 'bg-slate-400',
  },
};

export function StudentStatusBadge({ status, size = 'sm' }: StudentStatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.active;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${config.bg} ${config.text} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot} ${status === 'active' ? 'animate-pulse' : ''}`} />
      {config.label}
    </span>
  );
}
