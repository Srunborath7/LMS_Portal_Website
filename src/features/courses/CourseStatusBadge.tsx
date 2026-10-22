import type { CSSProperties } from 'react';
import type { CourseStatus } from '@/src/services/courses';

interface CourseStatusBadgeProps {
  status: CourseStatus;
  size?: 'sm' | 'md';
}

const statusStyles: Record<CourseStatus, { label: string; color: string; background: string }> = {
  published: { label: 'Published', color: 'var(--status-success)', background: 'var(--status-success-bg)' },
  draft: { label: 'Draft', color: 'var(--status-warning)', background: 'var(--status-warning-bg)' },
  archived: { label: 'Archived', color: 'var(--text-tertiary)', background: 'var(--bg-muted)' },
};

export function CourseStatusBadge({ status, size = 'sm' }: CourseStatusBadgeProps) {
  const style = statusStyles[status] ?? {
    label: status,
    color: 'var(--text-secondary)',
    background: 'var(--bg-muted)',
  };
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
