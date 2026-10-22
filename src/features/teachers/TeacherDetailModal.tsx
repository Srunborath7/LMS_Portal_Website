'use client';

import type { ReactNode } from 'react';
import type { TeacherOut } from '@/src/services/teachers/teachers.type';
import { toLocalDisplay } from '@/src/shared/utils/phone';
import { TeacherStatusBadge } from './TeacherStatusBadge';

interface TeacherDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherOut | null;
  onEdit: (teacher: TeacherOut) => void;
}

function Info({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0 rounded-xl border p-3.5" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-muted)' }}>
      <span className="block text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <div className="mt-0.5 break-words text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{children || '—'}</div>
    </div>
  );
}

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleDateString() : '—';
}

export function TeacherDetailModal({ isOpen, onClose, teacher, onEdit }: TeacherDetailModalProps) {
  if (!isOpen || !teacher) return null;

  const initials = teacher.full_name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'T';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      <button className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-label="Close teacher details" />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="teacher-detail-title"
        className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border shadow-2xl"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
      >
        <header className="flex items-center gap-4 border-b p-6" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-surface-raised)' }}>
          {teacher.image_url ? (
            <img src={teacher.image_url} alt="" className="h-14 w-14 rounded-xl object-cover" />
          ) : (
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl text-lg font-bold text-white" style={{ background: 'var(--brand-primary)' }}>{initials}</div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="teacher-detail-title" className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {teacher.title ? `${teacher.title} ` : ''}{teacher.full_name}
              </h2>
              <TeacherStatusBadge status={teacher.status} />
            </div>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              {teacher.teacher_code} · {teacher.specialization || 'No specialization listed'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => { onClose(); onEdit(teacher); }}
            className="rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-[var(--bg-surface-hover)]"
            style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
          >
            Edit profile
          </button>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-[var(--bg-surface-hover)]" style={{ color: 'var(--text-secondary)' }} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m18 6-12 12M6 6l12 12" /></svg>
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-6">
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Contact information</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Email"><a className="hover:underline" href={`mailto:${teacher.email}`} style={{ color: 'var(--brand-primary)' }}>{teacher.email}</a></Info>
              <Info label="Phone">{toLocalDisplay(teacher.phone)}</Info>
              <div className="sm:col-span-2"><Info label="Address">{teacher.address}</Info></div>
              <Info label="Emergency contact">{teacher.emergency_contact_name}</Info>
              <Info label="Emergency phone">{toLocalDisplay(teacher.emergency_contact_phone)}</Info>
              <Info label="Nationality">{teacher.nationality}</Info>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Professional profile</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Info label="Highest degree">{teacher.highest_degree}</Info>
              <Info label="Specialization">{teacher.specialization}</Info>
              <Info label="Experience">{teacher.years_of_experience == null ? '—' : `${teacher.years_of_experience} years`}</Info>
            </div>
            {teacher.bio && <p className="mt-3 rounded-xl border p-4 text-sm leading-relaxed" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-muted)', color: 'var(--text-secondary)' }}>{teacher.bio}</p>}
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Employment</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Info label="Employment type">{teacher.employment_type.replace('_', ' ')}</Info>
              <Info label="Hire date">{formatDate(teacher.hire_date)}</Info>
              <Info label="End date">{formatDate(teacher.end_date)}</Info>
              <Info label="Hourly rate">{teacher.hourly_rate == null ? '—' : teacher.hourly_rate}</Info>
              <Info label="Date of birth">{formatDate(teacher.date_of_birth)}</Info>
              <Info label="Gender">{teacher.gender}</Info>
            </div>
          </section>

          {/* Linked Auth Account */}
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Portal Login Account</h3>
            <div
              className="rounded-xl border p-4 flex items-center justify-between gap-3"
              style={{
                borderColor: teacher.auth_id ? 'var(--brand-primary)' : 'var(--border-default)',
                background: teacher.auth_id ? 'var(--bg-card, rgba(30, 42, 90, 0.04))' : 'var(--bg-muted)',
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-semibold"
                  style={{
                    background: teacher.auth_id ? 'var(--brand-primary)' : 'var(--border-default)',
                    color: teacher.auth_id ? '#ffffff' : 'var(--text-secondary)',
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
                      {teacher.auth_id ? 'Account Linked' : 'No Account Linked'}
                    </span>
                    {teacher.auth_id && (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                        Active Link
                      </span>
                    )}
                  </div>
                  {teacher.auth_id ? (
                    <p className="mt-0.5 font-mono text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>
                      Auth ID: {teacher.auth_id}
                    </p>
                  ) : (
                    <p className="mt-0.5 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                      Teacher cannot sign in until linked to an Auth account.
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(teacher);
                }}
                className="shrink-0 rounded-lg border px-2.5 py-1 text-xs font-medium transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
                style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
              >
                {teacher.auth_id ? 'Change' : 'Link Account'}
              </button>
            </div>
          </section>


          {teacher.note && (
            <section>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Administrative note</h3>
              <p className="rounded-xl border p-4 text-sm leading-relaxed" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-muted)', color: 'var(--text-secondary)' }}>{teacher.note}</p>
            </section>
          )}
        </div>

        <footer className="flex justify-end border-t px-6 py-3" style={{ borderColor: 'var(--border-default)' }}>
          <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-xs font-medium hover:bg-[var(--bg-surface-hover)]" style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}>Close</button>
        </footer>
      </section>
    </div>
  );
}
