'use client';

import { useLanguage } from '@/src/shared/hooks/useLanguage';
import { useAuth } from '@/src/features/auth/useAuth';
import { StatsOverview } from '@/src/features/dashboard/StatsOverview';
import { MyCourses } from '@/src/features/dashboard/MyCourses';
import { RecentActivity } from '@/src/features/dashboard/RecentActivity';
import { Deadlines } from '@/src/features/dashboard/Deadlines';
import { Announcements } from '@/src/features/dashboard/Announcements';

export default function DashboardPage() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const displayName = user?.name || 'Student';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {t.dashboard.welcome}, {displayName} 👋
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          {t.dashboard.overview}
        </p>
      </div>

      {/* Stats row */}
      <StatsOverview />

      {/* Courses grid */}
      <MyCourses />

      {/* Bottom row: Activity + Right column */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentActivity />
        <div className="space-y-6">
          <Deadlines />
          <Announcements />
        </div>
      </div>
    </div>
  );
}