import type { CourseLevel } from '@/src/services/courses';

interface CourseLevelBadgeProps {
  level: CourseLevel;
  className?: string;
}

const levelLabels: Record<CourseLevel, { label: string; color: string; bg: string }> = {
  beginner: { label: 'Beginner', color: '#059669', bg: 'rgba(16, 185, 129, 0.12)' },
  elementary: { label: 'Elementary', color: '#0284c7', bg: 'rgba(14, 165, 233, 0.12)' },
  intermediate: { label: 'Intermediate', color: '#d97706', bg: 'rgba(245, 158, 11, 0.12)' },
  upper_intermediate: { label: 'Upper Intermediate', color: '#ea580c', bg: 'rgba(234, 88, 12, 0.12)' },
  advanced: { label: 'Advanced', color: '#7c3aed', bg: 'rgba(139, 92, 246, 0.12)' },
  all_levels: { label: 'All Levels', color: 'var(--brand-primary)', bg: 'rgba(30, 42, 90, 0.08)' },
};

export function CourseLevelBadge({ level, className = '' }: CourseLevelBadgeProps) {
  const meta = levelLabels[level] ?? { label: level, color: 'var(--text-secondary)', bg: 'var(--bg-muted)' };

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${className}`}
      style={{
        color: meta.color,
        background: meta.bg,
      }}
    >
      {meta.label}
    </span>
  );
}
