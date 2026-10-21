import type { CSSProperties } from 'react';
import type { TeacherStatus } from '@/src/services/teachers/teachers.type';

interface TeacherStatusBadgeProps {
  status: TeacherStatus;
  size?: 'sm' | 'md';
}

const statusStyles: Record<TeacherStatus, { label: string; color: string; background: string }> = {
  active: { label: 'Active', color: 'var(--status-success)', background: 'var(--status-success-bg)' },
  on_leave: { label: 'On leave', color: 'var(--status-warning)', background: 'var(--status-warning-bg)' },
  resigned: { label: 'Resigned', color: 'var(--text-secondary)', background: 'var(--bg-muted)' },
  terminated: { label: 'Terminated', color: 'var(--status-error)', background: 'var(--status-error-bg)' },
};

export function TeacherStatusBadge({ status, size = 'sm' }: TeacherStatusBadgeProps) {
  const style = statusStyles[status];
  const dotStyle: CSSProperties = { background: style.color };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}
      style={{ color: style.color, background: style.background }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={dotStyle} />
      {style.label}
    </span>
  );
}
