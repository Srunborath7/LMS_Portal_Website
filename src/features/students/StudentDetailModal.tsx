'use client';

import React from 'react';
import type { StudentOut } from '@/src/services/students/students.types';
import { StudentStatusBadge } from './StudentStatusBadge';
import { toLocalDisplay } from '@/src/shared/utils/phone';

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentOut | null;
  onEdit: (student: StudentOut) => void;
}

export function StudentDetailModal({
  isOpen,
  onClose,
  student,
  onEdit,
}: StudentDetailModalProps) {
  if (!isOpen || !student) return null;

  const initials = student.full_name
    ? student.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'ST';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Detail Dialog */}
      <div
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border shadow-2xl animate-fade-in-scale max-h-[90vh] flex flex-col"
        style={{
          background: 'var(--bg-surface)',
          borderColor: 'var(--border-default)',
        }}
      >
        {/* Banner with Profile Info */}
        <div
          className="relative px-6 pt-8 pb-6 border-b"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 42, 90, 0.08), rgba(242, 177, 52, 0.08))',
            borderColor: 'var(--border-default)',
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              {student.image_url ? (
                <img
                  src={student.image_url}
                  alt={student.full_name}
                  className="h-16 w-16 rounded-2xl object-cover border-2 shadow-md"
                  style={{ borderColor: 'var(--border-strong)' }}
                />
              ) : (
                <div
                  className="grid h-16 w-16 place-items-center rounded-2xl text-xl font-bold shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-light, #3b82f6))',
                    color: '#ffffff',
                  }}
                >
                  {initials}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {student.full_name}
                </h2>
                <StudentStatusBadge status={student.status} size="md" />
              </div>

              <div className="mt-1 flex items-center gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span className="font-mono px-2 py-0.5 rounded border" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-muted)' }}>
                  {student.student_code}
                </span>
                {student.gender && (
                  <span className="capitalize">{student.gender}</span>
                )}
                {student.age !== null && student.age !== undefined && (
                  <span>• {student.age} years old</span>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onEdit(student);
              }}
              className="mt-2 sm:mt-0 flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-xs font-semibold shadow-sm transition hover:bg-[var(--bg-surface-hover)]"
              style={{
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>

        {/* Scrollable Information Body */}
        <div className="min-h-0 flex-1 overflow-y-auto p-6 space-y-6">
          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
              Contact Information
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border p-3.5" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-muted)' }}>
                <span className="block text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Email Address
                </span>
                <a
                  href={`mailto:${student.email}`}
                  className="mt-0.5 font-semibold text-sm hover:underline block truncate"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  {student.email}
                </a>
              </div>

              <div className="rounded-xl border p-3.5" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-muted)' }}>
                <span className="block text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Phone Number
                </span>
                <span className="mt-0.5 font-semibold text-sm block" style={{ color: 'var(--text-primary)' }}>
                  {toLocalDisplay(student.phone || '—')}
                </span>
              </div>
            </div>

            {student.address && (
              <div className="mt-3 rounded-xl border p-3.5" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-muted)' }}>
                <span className="block text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Residential Address
                </span>
                <p className="mt-0.5 text-xs leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {student.address}
                </p>
              </div>
            )}
          </div>

          {/* Guardian Information */}
          {(student.guardian_name || student.guardian_phone) && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
                Parent / Guardian Details
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border p-3.5" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-muted)' }}>
                  <span className="block text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Guardian Name
                  </span>
                  <span className="mt-0.5 font-semibold text-sm block" style={{ color: 'var(--text-primary)' }}>
                    {student.guardian_name || '—'}
                  </span>
                </div>
                <div className="rounded-xl border p-3.5" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-muted)' }}>
                  <span className="block text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Guardian Phone
                  </span>
                  <span className="mt-0.5 font-semibold text-sm block" style={{ color: 'var(--text-primary)' }}>
                    {toLocalDisplay(student.guardian_phone || '—')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Academic Info & Dates */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
              Academic & Enrollment
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border p-3" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-muted)' }}>
                <span className="block text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                  Date of Birth
                </span>
                <span className="mt-0.5 font-semibold text-xs block" style={{ color: 'var(--text-primary)' }}>
                  {student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : '—'}
                </span>
              </div>
              <div className="rounded-xl border p-3" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-muted)' }}>
                <span className="block text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                  Enrolled At
                </span>
                <span className="mt-0.5 font-semibold text-xs block" style={{ color: 'var(--text-primary)' }}>
                  {student.enrolled_at ? new Date(student.enrolled_at).toLocaleDateString() : '—'}
                </span>
              </div>
              <div className="rounded-xl border p-3" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-muted)' }}>
                <span className="block text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                  Registered Date
                </span>
                <span className="mt-0.5 font-semibold text-xs block" style={{ color: 'var(--text-primary)' }}>
                  {student.created_at ? new Date(student.created_at).toLocaleDateString() : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Linked Auth Account */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
              Portal Login Account
            </h3>
            <div
              className="rounded-xl border p-4 flex items-center justify-between gap-3"
              style={{
                borderColor: student.auth_id ? 'var(--brand-primary)' : 'var(--border-default)',
                background: student.auth_id ? 'var(--bg-card, rgba(30, 42, 90, 0.04))' : 'var(--bg-muted)',
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-semibold"
                  style={{
                    background: student.auth_id ? 'var(--brand-primary)' : 'var(--border-default)',
                    color: student.auth_id ? '#ffffff' : 'var(--text-secondary)',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {student.auth_id ? 'Account Linked' : 'No Account Linked'}
                    </span>
                    {student.auth_id && (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                        Active Link
                      </span>
                    )}
                  </div>
                  {student.auth_id ? (
                    <p className="mt-0.5 font-mono text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>
                      Auth ID: {student.auth_id}
                    </p>
                  ) : (
                    <p className="mt-0.5 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                      Student cannot sign in until linked to an Auth account.
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(student);
                }}
                className="shrink-0 rounded-lg border px-2.5 py-1 text-xs font-medium transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
                style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
              >
                {student.auth_id ? 'Change' : 'Link Account'}
              </button>
            </div>
          </div>


          {/* Administrative Note */}
          {student.note && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
                Administrative Notes
              </h3>
              <div
                className="rounded-xl border p-4 text-xs leading-relaxed"
                style={{
                  borderColor: 'var(--border-default)',
                  background: 'var(--bg-muted)',
                  color: 'var(--text-secondary)',
                }}
              >
                {student.note}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="border-t px-6 py-3 flex justify-end"
          style={{ borderColor: 'var(--border-default)', background: 'var(--bg-surface)' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-xs font-medium transition hover:bg-[var(--bg-surface-hover)]"
            style={{
              borderColor: 'var(--border-default)',
              color: 'var(--text-secondary)',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
