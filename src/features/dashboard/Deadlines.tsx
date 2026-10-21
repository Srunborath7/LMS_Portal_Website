'use client';

import { useLanguage } from '@/src/shared/hooks/useLanguage';

export function Deadlines() {
  const { t } = useLanguage();
  const deadlines = [
    { title: 'Python data project', course: 'Data Analysis with Python', when: `2 ${t.dashboard.days}`, color: '#D97706' },
    { title: 'Module 4 quiz', course: 'Project Management Essentials', when: t.dashboard.today, color: '#DC2626' },
  ];
  return (
    <section className="rounded-xl border p-5" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}>
      <h2 className="mb-4 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{t.dashboard.upcomingDeadlines}</h2>
      {deadlines.length ? <ul className="space-y-4">{deadlines.map((item) => (
        <li key={item.title} className="flex items-start justify-between gap-3">
          <div><p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.title}</p><p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.course}</p></div>
          <span className="shrink-0 rounded-full px-2 py-1 text-xs font-semibold" style={{ background: `${item.color}18`, color: item.color }}>{item.when}</span>
        </li>
      ))}</ul> : <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t.dashboard.noDeadlines}</p>}
    </section>
  );
}
