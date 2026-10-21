'use client';

import { useLanguage } from '@/src/shared/hooks/useLanguage';

export function RecentActivity() {
  const { t } = useLanguage();
  const entries = [
    { title: 'Completed “Python Basics” lesson', time: t.dashboard.justNow, color: '#059669' },
    { title: 'Submitted “Project Plan” assignment', time: `2 ${t.dashboard.hoursAgo}`, color: '#4F46E5' },
    { title: 'Started “Business Writing”', time: t.dashboard.yesterday, color: '#D97706' },
  ];
  return (
    <section className="rounded-xl border p-5" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}>
      <h2 className="mb-5 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{t.dashboard.recentActivity}</h2>
      <ul className="space-y-5">
        {entries.map((entry) => (
          <li key={entry.title} className="flex gap-3">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: entry.color }} />
            <div><p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{entry.title}</p><p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>{entry.time}</p></div>
          </li>
        ))}
      </ul>
    </section>
  );
}
