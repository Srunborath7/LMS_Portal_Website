'use client';

import type { CourseOut, CourseStatus } from '@/src/services/courses';
import { CourseStatusBadge } from './CourseStatusBadge';
import { CourseLevelBadge } from './CourseLevelBadge';

interface CourseDetailModalProps {
  course: CourseOut | null;
  open: boolean;
  onClose: () => void;
  onEdit: (course: CourseOut) => void;
  onChangeStatus?: (course: CourseOut, nextStatus: CourseStatus) => void;
}

export function CourseDetailModal({
  course,
  open,
  onClose,
  onEdit,
  onChangeStatus,
}: CourseDetailModalProps) {
  if (!open || !course) return null;

  const isPublished = course.status === 'published';
  const isArchived = course.status === 'archived';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border shadow-2xl animate-fade-in-scale"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b px-6 py-5" style={{ borderColor: 'var(--border-default)' }}>
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-xl font-bold shadow-sm"
              style={{
                background: 'linear-gradient(135deg, var(--brand-primary), #3b4d8c)',
                color: 'white',
              }}
            >
              {course.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[var(--bg-muted)]" style={{ color: 'var(--text-secondary)' }}>
                  {course.course_code}
                </span>
                <CourseStatusBadge status={course.status} />
                <CourseLevelBadge level={course.level} />
              </div>
              <h3 className="mt-1 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {course.name}
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {course.category ?? 'Uncategorized'} • {course.language.toUpperCase()}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 transition hover:bg-[var(--bg-surface-hover)]"
            style={{ color: 'var(--text-tertiary)' }}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6 text-sm">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border p-3.5" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
              <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Tuition Fee</p>
              <p className="mt-1 text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                {Number(course.fee) === 0 ? 'Free' : `${course.fee} ${course.currency}`}
              </p>
            </div>
            <div className="rounded-xl border p-3.5" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
              <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Duration</p>
              <p className="mt-1 text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                {course.duration_hours ? `${course.duration_hours} hrs` : 'Self-paced'}
              </p>
            </div>
            <div className="rounded-xl border p-3.5" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
              <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Language</p>
              <p className="mt-1 text-base font-bold capitalize" style={{ color: 'var(--text-primary)' }}>
                {course.language}
              </p>
            </div>
            <div className="rounded-xl border p-3.5" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
              <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Published</p>
              <p className="mt-1 text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                {course.published_at ? new Date(course.published_at).toLocaleDateString() : 'Not published'}
              </p>
            </div>
          </div>

          {/* Objectives */}
          {course.objectives && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                Learning Objectives
              </h4>
              <p className="mt-2 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {course.objectives}
              </p>
            </div>
          )}

          {/* Description */}
          {course.description && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                Description
              </h4>
              <p className="mt-2 whitespace-pre-line leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {course.description}
              </p>
            </div>
          )}

          {/* Metadata timeline */}
          <div className="rounded-xl border p-4 text-xs" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" style={{ color: 'var(--text-tertiary)' }}>
              <div>Created: <span className="font-medium text-[var(--text-secondary)]">{new Date(course.created_at).toLocaleString()}</span></div>
              <div>Last Updated: <span className="font-medium text-[var(--text-secondary)]">{new Date(course.updated_at).toLocaleString()}</span></div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-6 py-4" style={{ borderColor: 'var(--border-default)' }}>
          <div className="flex items-center gap-2">
            {onChangeStatus && (
              <>
                {isPublished ? (
                  <button
                    type="button"
                    onClick={() => onChangeStatus(course, 'draft')}
                    className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition hover:bg-[var(--bg-surface-hover)]"
                    style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                  >
                    Unpublish
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onChangeStatus(course, 'published')}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:brightness-110"
                    style={{ background: 'var(--status-success)' }}
                  >
                    Publish Course
                  </button>
                )}

                {isArchived ? (
                  <button
                    type="button"
                    onClick={() => onChangeStatus(course, 'draft')}
                    className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition hover:bg-[var(--bg-surface-hover)]"
                    style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                  >
                    Restore Course
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onChangeStatus(course, 'archived')}
                    className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition hover:bg-[var(--bg-surface-hover)]"
                    style={{ borderColor: 'var(--border-default)', color: 'var(--status-error)' }}
                  >
                    Archive
                  </button>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-[var(--bg-surface-hover)]"
              style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(course);
              }}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
              style={{ background: 'var(--brand-primary)' }}
            >
              Edit Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
