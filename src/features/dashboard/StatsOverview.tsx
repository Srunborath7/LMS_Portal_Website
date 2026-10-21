'use client';

import { useLanguage } from '@/src/shared/hooks/useLanguage';
import { StatsCard } from '@/src/components/ui/StatsCard';

const metrics = [
  { key: 'enrolledCourses' as const, value: 6, color: '#4F46E5', icon: '▤' },
  { key: 'completed' as const, value: 12, color: '#059669', icon: '✓' },
  { key: 'certificates' as const, value: 3, color: '#D97706', icon: '★' },
  { key: 'hoursLearned' as const, value: 48, color: '#0284C7', icon: '◷' },
];

export function StatsOverview() {
  const { t } = useLanguage();
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => (
        <StatsCard
          key={metric.key}
          label={t.dashboard[metric.key]}
          value={metric.value}
          color={metric.color}
          delay={index * 100}
          icon={<span className="text-xl font-semibold" aria-hidden="true">{metric.icon}</span>}
        />
      ))}
    </section>
  );
}
