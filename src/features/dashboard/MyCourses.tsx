'use client';

import { useLanguage } from '@/src/shared/hooks/useLanguage';

const courses = [
  { title: 'Data Analysis with Python', category: 'Data & Technology', progress: 72, color: '#4F46E5' },
  { title: 'Project Management Essentials', category: 'Business', progress: 45, color: '#0D9488' },
  { title: 'Business Writing', category: 'Communication', progress: 18, color: '#D97706' },
];

export function MyCourses() {
  const { t } = useLanguage();
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{t.dashboard.myCourses}</h2>
        <a href="/courses" className="text-sm font-medium" style={{ color: 'var(--brand-primary)' }}>{t.seeMore}</a>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <article key={course.title} className="rounded-xl border p-5" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}>
            <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg text-lg font-bold text-white" style={{ background: course.color }}>{course.title[0]}</div>
            <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>{course.category}</p>
            <h3 className="mt-1 font-semibold" style={{ color: 'var(--text-primary)' }}>{course.title}</h3>
            <div className="mt-4 flex justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span>{t.dashboard.progress}</span><span>{course.progress}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--bg-muted)' }}>
              <div className="h-full rounded-full" style={{ width: `${course.progress}%`, background: course.color }} />
            </div>
            <a href="/courses" className="mt-4 inline-block text-sm font-semibold" style={{ color: 'var(--brand-primary)' }}>{t.dashboard.continueLabel} →</a>
          </article>
        ))}
      </div>
    </section>
  );
}
