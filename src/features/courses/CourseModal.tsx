'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import type {
  CourseCreate,
  CourseLevel,
  CourseOut,
  CourseUpdate,
} from '@/src/services/courses';
import { Spinner } from '@/src/components/ui/Spinner';

interface CourseModalProps {
  course: CourseOut | null;
  open: boolean;
  onClose: () => void;
  onSave: (payload: CourseCreate | CourseUpdate) => Promise<void>;
}

const LEVEL_OPTIONS: { value: CourseLevel; label: string }[] = [
  { value: 'all_levels', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'elementary', label: 'Elementary' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'upper_intermediate', label: 'Upper Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const PRESET_CATEGORIES = [
  'Computer Science',
  'Data Science',
  'Design',
  'Language',
  'Business',
  'Marketing',
  'DevOps & Cloud',
  'Engineering',
];

export function CourseModal({ course, open, onClose, onSave }: CourseModalProps) {
  const isEditing = Boolean(course);

  const [name, setName] = useState(course?.name ?? '');
  const [category, setCategory] = useState(course?.category ?? 'Computer Science');
  const [level, setLevel] = useState<CourseLevel>(course?.level ?? 'all_levels');
  const [language, setLanguage] = useState(course?.language ?? 'en');
  const [durationHours, setDurationHours] = useState(course?.duration_hours ?? '36');
  const [fee, setFee] = useState(course?.fee ?? '0.00');
  const [currency, setCurrency] = useState(course?.currency ?? 'USD');
  const [thumbnailUrl, setThumbnailUrl] = useState(course?.thumbnail_url ?? '');
  const [objectives, setObjectives] = useState(course?.objectives ?? '');
  const [description, setDescription] = useState(course?.description ?? '');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Course name is required.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload: CourseCreate = {
        name: name.trim(),
        category: category.trim() || null,
        level,
        language: language.trim() || 'en',
        duration_hours: durationHours ? Number(durationHours) : null,
        fee: fee ? Number(fee) : 0,
        currency: currency.trim().toUpperCase() || 'USD',
        thumbnail_url: thumbnailUrl.trim() || null,
        objectives: objectives.trim() || null,
        description: description.trim() || null,
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save course. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    'mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border shadow-2xl animate-fade-in-scale"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: 'var(--border-default)' }}>
          <div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {isEditing ? `Edit Course: ${course?.course_code}` : 'Create New Course'}
            </h3>
            <p className="mt-0.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {isEditing
                ? 'Update curriculum details, syllabus objectives and course settings.'
                : 'Fill in course details to create a new syllabus.'}
            </p>
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="rounded-lg p-1.5 transition hover:bg-[var(--bg-surface-hover)]"
            style={{ color: 'var(--text-tertiary)' }}
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto p-6">
          {error && (
            <div
              className="mb-5 rounded-lg border px-3.5 py-2.5 text-sm"
              style={{
                borderColor: 'var(--status-error)',
                background: 'var(--status-error-bg)',
                color: 'var(--status-error)',
              }}
            >
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Course Title */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={150}
                placeholder="e.g. Advanced TypeScript and Next.js"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                style={{
                  borderColor: 'var(--border-default)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            {/* Category & Level */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Category
                </label>
                <div className="relative">
                  <input
                    type="text"
                    list="course-categories"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className={inputClass}
                    style={{
                      borderColor: 'var(--border-default)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <datalist id="course-categories">
                    {PRESET_CATEGORIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Target Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as CourseLevel)}
                  className={inputClass}
                  style={{
                    borderColor: 'var(--border-default)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {LEVEL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Duration, Fee & Language */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Duration (Hours)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="e.g. 48"
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                  className={inputClass}
                  style={{
                    borderColor: 'var(--border-default)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Tuition Fee
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  className={inputClass}
                  style={{
                    borderColor: 'var(--border-default)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className={inputClass}
                  style={{
                    borderColor: 'var(--border-default)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value="USD">USD ($)</option>
                  <option value="KHR">KHR (៛)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            {/* Language & Thumbnail */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Instruction Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={inputClass}
                  style={{
                    borderColor: 'var(--border-default)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value="en">English (en)</option>
                  <option value="km">Khmer (km)</option>
                  <option value="fr">French (fr)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className={inputClass}
                  style={{
                    borderColor: 'var(--border-default)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>

            {/* Objectives */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Learning Objectives
              </label>
              <textarea
                rows={2}
                placeholder="What skills will students gain upon finishing this course?"
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                className={inputClass}
                style={{
                  borderColor: 'var(--border-default)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Overview Description
              </label>
              <textarea
                rows={3}
                placeholder="Detailed summary of topics, prerequisite knowledge, and syllabus breakdown..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={inputClass}
                style={{
                  borderColor: 'var(--border-default)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t pt-4" style={{ borderColor: 'var(--border-default)' }}>
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-[var(--bg-surface-hover)]"
              style={{
                borderColor: 'var(--border-default)',
                color: 'var(--text-secondary)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 active:brightness-95 disabled:opacity-70"
              style={{ background: 'var(--brand-primary)' }}
            >
              {submitting && <Spinner size={14} />}
              {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
