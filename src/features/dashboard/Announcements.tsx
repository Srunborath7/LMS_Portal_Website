'use client';

import { useLanguage } from '@/src/shared/hooks/useLanguage';

export function Announcements() {
  const { t } = useLanguage();
  return (
    <section className="rounded-xl border p-5" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}>
      <h2 className="mb-3 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{t.dashboard.announcements}</h2>
      <article className="rounded-lg p-3" style={{ background: 'var(--bg-muted)' }}>
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Welcome to your learning portal</p>
        <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Explore your courses, keep track of upcoming work, and celebrate each milestone.</p>
      </article>
    </section>
  );
}
