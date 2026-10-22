'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { coursesApi } from '@/src/services/courses';
import type {
  CourseCreate,
  CourseLevel,
  CourseOut,
  CourseStatus,
  CourseUpdate,
} from '@/src/services/courses';
import { mockCourses } from '@/src/features/courses/mockData';
import { CourseStatusBadge } from '@/src/features/courses/CourseStatusBadge';
import { CourseLevelBadge } from '@/src/features/courses/CourseLevelBadge';
import { CourseModal } from '@/src/features/courses/CourseModal';
import { CourseDetailModal } from '@/src/features/courses/CourseDetailModal';
import { StatsCard } from '@/src/components/ui/StatsCard';
import { Spinner } from '@/src/components/ui/Spinner';

type CoursePayload = CourseCreate | CourseUpdate;

function mergeCourse(current: CourseOut, payload: CoursePayload): CourseOut {
  return {
    ...current,
    name: payload.name ?? current.name,
    category: payload.category !== undefined ? payload.category : current.category,
    level: payload.level ?? current.level,
    language: payload.language ?? current.language,
    duration_hours:
      payload.duration_hours !== undefined
        ? payload.duration_hours != null
          ? String(payload.duration_hours)
          : null
        : current.duration_hours,
    fee:
      payload.fee !== undefined
        ? payload.fee != null
          ? String(payload.fee)
          : '0'
        : current.fee,
    currency: payload.currency ?? current.currency,
    thumbnail_url:
      payload.thumbnail_url !== undefined ? payload.thumbnail_url : current.thumbnail_url,
    objectives: payload.objectives !== undefined ? payload.objectives : current.objectives,
    description: payload.description !== undefined ? payload.description : current.description,
    updated_at: new Date().toISOString(),
  };
}

function createMockCourse(payload: CourseCreate): CourseOut {
  const now = new Date().toISOString();
  return {
    id: `course-${Date.now()}`,
    course_code: `CRS-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
    name: payload.name,
    category: payload.category ?? 'General',
    level: payload.level ?? 'all_levels',
    language: payload.language ?? 'en',
    duration_hours: payload.duration_hours != null ? String(payload.duration_hours) : null,
    fee: payload.fee != null ? String(payload.fee) : '0',
    currency: payload.currency ?? 'USD',
    thumbnail_url: payload.thumbnail_url ?? null,
    objectives: payload.objectives ?? null,
    description: payload.description ?? null,
    status: 'draft',
    published_at: null,
    created_at: now,
    updated_at: now,
    created_by_id: null,
    updated_by_id: null,
  };
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<CourseStatus | 'all'>('all');
  const [level, setLevel] = useState<CourseLevel | 'all'>('all');
  const [category, setCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [editing, setEditing] = useState<CourseOut | null>(null);
  const [viewing, setViewing] = useState<CourseOut | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<CourseOut | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const result = await coursesApi.list({
        q: search.trim() || undefined,
        status: status === 'all' ? undefined : status,
        level: level === 'all' ? undefined : level,
        category: category === 'all' ? undefined : category,
        size: 100,
      });
      setCourses(result.items);
      setUsingFallback(false);
    } catch {
      const query = search.trim().toLowerCase();
      setCourses(
        mockCourses.filter(
          (c) =>
            (!query ||
              `${c.name} ${c.course_code} ${c.category ?? ''} ${c.description ?? ''}`
                .toLowerCase()
                .includes(query)) &&
            (status === 'all' || c.status === status) &&
            (level === 'all' || c.level === level) &&
            (category === 'all' || c.category === category)
        )
      );
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, [search, status, level, category]);

  useEffect(() => {
    void loadCourses();
  }, [loadCourses]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    mockCourses.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [courses]);

  const stats = useMemo(
    () => ({
      total: courses.length,
      published: courses.filter((c) => c.status === 'published').length,
      draft: courses.filter((c) => c.status === 'draft').length,
      archived: courses.filter((c) => c.status === 'archived').length,
    }),
    [courses]
  );

  async function handleSaveCourse(payload: CoursePayload) {
    try {
      if (editing) {
        if (usingFallback) {
          setCourses((prev) =>
            prev.map((item) => (item.id === editing.id ? mergeCourse(item, payload) : item))
          );
        } else {
          const updated = await coursesApi.update(editing.id, payload as CourseUpdate);
          setCourses((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        }
        setNotification({ type: 'success', text: 'Course updated successfully.' });
      } else {
        if (usingFallback) {
          const created = createMockCourse(payload as CourseCreate);
          setCourses((prev) => [created, ...prev]);
        } else {
          const created = await coursesApi.create(payload as CourseCreate);
          setCourses((prev) => [created, ...prev]);
        }
        setNotification({ type: 'success', text: 'Course created successfully.' });
      }
      setFormOpen(false);
      setEditing(null);
    } catch (err) {
      setNotification({
        type: 'error',
        text: err instanceof Error ? err.message : 'Could not save the course.',
      });
      throw err;
    }
  }

  async function handleChangeStatus(course: CourseOut, nextStatus: CourseStatus) {
    try {
      if (!usingFallback) {
        if (nextStatus === 'published') {
          await coursesApi.publish(course.id);
        } else if (nextStatus === 'archived') {
          await coursesApi.archive(course.id);
        } else if (course.status === 'archived') {
          await coursesApi.restore(course.id);
        } else {
          await coursesApi.unpublish(course.id);
        }
      }

      setCourses((prev) =>
        prev.map((c) =>
          c.id === course.id
            ? {
                ...c,
                status: nextStatus,
                published_at: nextStatus === 'published' ? new Date().toISOString() : c.published_at,
                updated_at: new Date().toISOString(),
              }
            : c
        )
      );

      if (viewing?.id === course.id) {
        setViewing((prev) =>
          prev
            ? {
                ...prev,
                status: nextStatus,
                published_at: nextStatus === 'published' ? new Date().toISOString() : prev.published_at,
              }
            : null
        );
      }

      setNotification({
        type: 'success',
        text: `Course ${nextStatus === 'published' ? 'published' : nextStatus === 'archived' ? 'archived' : 'moved to draft'}.`,
      });
    } catch (err) {
      setNotification({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update course status.',
      });
    }
  }

  async function handleDeleteCourse() {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      if (!usingFallback) {
        await coursesApi.delete(deleting.id);
      }
      setCourses((prev) => prev.filter((c) => c.id !== deleting.id));
      setNotification({ type: 'success', text: `Course "${deleting.name}" deleted.` });
      setDeleting(null);
    } catch (err) {
      setNotification({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to delete course.',
      });
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Course Management
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Design course curricula, manage syllabi, tuition fees, and publication states.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border p-1" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-surface)' }}>
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`rounded p-1.5 transition ${viewMode === 'grid' ? 'bg-[var(--brand-primary)] text-white shadow-sm' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('table')}
              aria-label="Table view"
              className={`rounded p-1.5 transition ${viewMode === 'table' ? 'bg-[var(--brand-primary)] text-white shadow-sm' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>

          <button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110 active:brightness-95"
            style={{ background: 'var(--brand-primary)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Course
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          role="alert"
          className="flex items-center justify-between rounded-xl border p-4 text-sm animate-fade-in"
          style={{
            borderColor: notification.type === 'success' ? 'var(--status-success)' : 'var(--status-error)',
            background: notification.type === 'success' ? 'var(--status-success-bg)' : 'var(--status-error-bg)',
            color: notification.type === 'success' ? 'var(--status-success)' : 'var(--status-error)',
          }}
        >
          <span>{notification.text}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-xs font-bold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Total Courses"
          value={stats.total}
          color="#3B82F6"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          }
        />
        <StatsCard
          label="Published Courses"
          value={stats.published}
          color="#10B981"
          delay={100}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
        />
        <StatsCard
          label="Drafts in Progress"
          value={stats.draft}
          color="#F59E0B"
          delay={200}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          }
        />
        <StatsCard
          label="Archived"
          value={stats.archived}
          color="#8B5CF6"
          delay={300}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="21 8 21 21 3 21 3 8" />
              <rect x="1" y="3" width="22" height="5" />
              <line x1="10" y1="12" x2="14" y2="12" />
            </svg>
          }
        />
      </div>

      {/* Filter and Search Bar */}
      <div
        className="flex flex-col gap-3 rounded-2xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
      >
        <div className="relative flex-1">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Search courses by title, code or topic…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--brand-primary)]"
            style={{
              borderColor: 'var(--border-default)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as CourseStatus | 'all')}
            className="rounded-xl border px-3 py-2 text-xs font-medium outline-none transition focus:border-[var(--brand-primary)]"
            style={{
              borderColor: 'var(--border-default)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Level Filter */}
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as CourseLevel | 'all')}
            className="rounded-xl border px-3 py-2 text-xs font-medium outline-none transition focus:border-[var(--brand-primary)]"
            style={{
              borderColor: 'var(--border-default)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="elementary">Elementary</option>
            <option value="intermediate">Intermediate</option>
            <option value="upper_intermediate">Upper Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="all_levels">All Levels Tier</option>
          </select>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border px-3 py-2 text-xs font-medium outline-none transition focus:border-[var(--brand-primary)]"
            style={{
              borderColor: 'var(--border-default)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-surface)' }}>
          <div className="flex items-center gap-3" style={{ color: 'var(--text-secondary)' }}>
            <Spinner size={24} />
            <span className="text-sm font-medium">Loading courses…</span>
          </div>
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border py-16 text-center" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-surface)' }}>
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[var(--bg-muted)] text-[var(--text-tertiary)]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <h3 className="mt-4 text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            No courses found
          </h3>
          <p className="mt-1 text-sm max-w-sm" style={{ color: 'var(--text-secondary)' }}>
            {search || status !== 'all' || level !== 'all' || category !== 'all'
              ? 'Try adjusting your search criteria or resetting active filters.'
              : 'Get started by creating your very first course curriculum.'}
          </p>
          {(search || status !== 'all' || level !== 'all' || category !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setStatus('all');
                setLevel('all');
                setCategory('all');
              }}
              className="mt-4 rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition hover:bg-[var(--bg-surface-hover)]"
              style={{ borderColor: 'var(--border-default)', color: 'var(--brand-primary)' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const isFree = Number(course.fee) === 0;
            return (
              <article
                key={course.id}
                className="group flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold text-white shadow-sm"
                      style={{
                        background: 'linear-gradient(135deg, var(--brand-primary), #3b4d8c)',
                      }}
                    >
                      {course.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <CourseStatusBadge status={course.status} />
                      <CourseLevelBadge level={course.level} />
                    </div>
                  </div>

                  {/* Title & Code */}
                  <div className="mt-3">
                    <span className="font-mono text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                      {course.course_code}
                    </span>
                    <h3
                      className="mt-1 font-bold line-clamp-1 group-hover:text-[var(--brand-primary)] transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {course.name}
                    </h3>
                    <p className="mt-0.5 text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                      {course.category ?? 'General'}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="mt-2.5 text-xs line-clamp-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {course.description || course.objectives || 'No syllabus description provided.'}
                  </p>
                </div>

                {/* Footer Info & Actions */}
                <div className="mt-5 border-t pt-4" style={{ borderColor: 'var(--border-default)' }}>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5" style={{ color: 'var(--text-tertiary)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>{course.duration_hours ? `${course.duration_hours} hrs` : 'Self-paced'}</span>
                    </div>

                    <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                      {isFree ? (
                        <span className="text-emerald-600 font-semibold text-xs uppercase tracking-wider">Free</span>
                      ) : (
                        `${course.fee} ${course.currency}`
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setViewing(course)}
                      className="flex-1 rounded-lg border py-1.5 text-xs font-semibold transition hover:bg-[var(--bg-surface-hover)]"
                      style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        setEditing(course);
                        setFormOpen(true);
                      }}
                      className="rounded-lg p-1.5 transition hover:bg-[var(--bg-surface-hover)]"
                      style={{ color: 'var(--text-secondary)' }}
                      title="Edit Course"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleting(course)}
                      className="rounded-lg p-1.5 transition hover:bg-[var(--bg-surface-hover)]"
                      style={{ color: 'var(--status-error)' }}
                      title="Delete Course"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-hidden rounded-2xl border shadow-sm" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-xs font-semibold uppercase tracking-wider" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)', color: 'var(--text-tertiary)' }}>
                <tr>
                  <th className="px-5 py-3.5">Course</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Level</th>
                  <th className="px-4 py-3.5">Duration</th>
                  <th className="px-4 py-3.5">Fee</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-default)' }}>
                {courses.map((course) => (
                  <tr key={course.id} className="transition-colors hover:bg-[var(--bg-surface-hover)]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white shadow-sm"
                          style={{ background: 'var(--brand-primary)' }}
                        >
                          {course.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {course.name}
                          </p>
                          <span className="font-mono text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            {course.course_code}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {course.category ?? '—'}
                    </td>
                    <td className="px-4 py-4">
                      <CourseLevelBadge level={course.level} />
                    </td>
                    <td className="px-4 py-4 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {course.duration_hours ? `${course.duration_hours} hrs` : 'Self-paced'}
                    </td>
                    <td className="px-4 py-4 text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      {Number(course.fee) === 0 ? 'Free' : `${course.fee} ${course.currency}`}
                    </td>
                    <td className="px-4 py-4">
                      <CourseStatusBadge status={course.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewing(course)}
                          className="rounded-lg p-1.5 transition hover:bg-[var(--bg-muted)]"
                          style={{ color: 'var(--text-secondary)' }}
                          title="View Details"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setEditing(course);
                            setFormOpen(true);
                          }}
                          className="rounded-lg p-1.5 transition hover:bg-[var(--bg-muted)]"
                          style={{ color: 'var(--text-secondary)' }}
                          title="Edit Course"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleting(course)}
                          className="rounded-lg p-1.5 transition hover:bg-[var(--bg-muted)]"
                          style={{ color: 'var(--status-error)' }}
                          title="Delete Course"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Course Create / Edit Modal */}
      <CourseModal
        course={editing}
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSave={handleSaveCourse}
      />

      {/* Course Detail Modal */}
      <CourseDetailModal
        course={viewing}
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        onEdit={(course) => {
          setEditing(course);
          setFormOpen(true);
        }}
        onChangeStatus={handleChangeStatus}
      />

      {/* Delete Confirmation Modal */}
      {deleting && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}
        >
          <div
            className="w-full max-w-md rounded-2xl border p-6 shadow-2xl animate-fade-in-scale"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-100 text-red-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  Delete Course?
                </h3>
                <p className="mt-0.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {deleting.course_code}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Are you sure you want to delete <span className="font-semibold text-[var(--text-primary)]">{deleting.name}</span>? This action will remove the curriculum record.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => setDeleting(null)}
                className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-[var(--bg-surface-hover)]"
                style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleDeleteCourse}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 active:brightness-95 disabled:opacity-70"
                style={{ background: 'var(--status-error)' }}
              >
                {deleteLoading && <Spinner size={14} />}
                {deleteLoading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}