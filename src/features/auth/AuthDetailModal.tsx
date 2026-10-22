'use client';

import React, { useState } from 'react';
import type { AuthOut } from '@/src/types/auth.types';
import { AuthStatusBadge } from './AuthStatusBadge';

interface LinkedInfo {
  type: 'student' | 'teacher';
  name: string;
  code: string;
  email: string;
}

interface AuthDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: AuthOut | null;
  linkedInfo?: LinkedInfo | null;
}

export function AuthDetailModal({
  isOpen,
  onClose,
  account,
  linkedInfo,
}: AuthDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !account) return null;

  function copyId() {
    if (!account) return;
    navigator.clipboard.writeText(account.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const initials = account.username
    ? account.username.slice(0, 2).toUpperCase()
    : 'AU';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl animate-fade-in-scale max-h-[90vh] flex flex-col"
        style={{
          background: 'var(--bg-surface)',
          borderColor: 'var(--border-default)',
        }}
      >
        {/* Banner with Profile */}
        <div
          className="relative px-6 pt-6 pb-5 border-b"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 42, 90, 0.08), rgba(242, 177, 52, 0.08))',
            borderColor: 'var(--border-default)',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            <div
              className="grid h-14 w-14 place-items-center rounded-2xl text-lg font-bold shadow-md text-white"
              style={{
                background: 'linear-gradient(135deg, var(--brand-primary), #2b3d82)',
              }}
            >
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {account.username}
                </h2>
                <AuthStatusBadge
                  isActive={account.is_active}
                  isVerified={account.is_verified}
                  isLocked={Boolean(account.locked_until && new Date(account.locked_until) > new Date())}
                  size="sm"
                />
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {account.email}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="min-h-0 flex-1 overflow-y-auto p-6 space-y-5">
          {/* UUID Card with 1-click Copy */}
          <div
            className="rounded-xl border p-3.5"
            style={{
              borderColor: 'var(--border-default)',
              background: 'var(--bg-muted)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Auth ID (UUID)
              </span>
              <button
                type="button"
                onClick={copyId}
                className="flex items-center gap-1 text-xs font-medium hover:underline"
                style={{ color: 'var(--brand-primary)' }}
              >
                {copied ? (
                  <span className="text-emerald-500 font-semibold">✓ Copied to clipboard!</span>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy UUID
                  </>
                )}
              </button>
            </div>
            <p className="mt-1 font-mono text-xs font-semibold select-all" style={{ color: 'var(--text-primary)' }}>
              {account.id}
            </p>
          </div>

          {/* Linked Record Status */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Linked Portal Record
            </h3>
            {linkedInfo ? (
              <div
                className="rounded-xl border p-4 flex items-center justify-between gap-3"
                style={{
                  borderColor: 'var(--brand-primary)',
                  background: 'var(--bg-card, rgba(30, 42, 90, 0.04))',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white font-semibold text-xs"
                    style={{
                      background: linkedInfo.type === 'student' ? '#1E2A5A' : '#F2B134',
                      color: linkedInfo.type === 'student' ? '#ffffff' : '#1E2A5A',
                    }}
                  >
                    {linkedInfo.type === 'student' ? 'STU' : 'TCH'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                        {linkedInfo.name}
                      </span>
                      <span className="rounded bg-black/5 dark:bg-white/10 px-1.5 py-0.2 text-[10px] font-mono text-[var(--text-secondary)]">
                        {linkedInfo.code}
                      </span>
                    </div>
                    <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                      Role: {linkedInfo.type === 'student' ? 'Student Profile' : 'Teacher Profile'} ({linkedInfo.email})
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  Linked
                </span>
              </div>
            ) : (
              <div
                className="rounded-xl border p-4 flex items-center justify-between gap-3"
                style={{
                  borderColor: 'var(--border-default)',
                  background: 'var(--bg-muted)',
                }}
              >
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Not linked to any student or teacher
                  </p>
                  <p className="mt-0.5 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                    Copy this Auth ID and paste it in the Student or Teacher modal to link.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyId}
                  className="rounded-lg border px-2.5 py-1 text-xs font-medium hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
                  style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                >
                  {copied ? 'Copied' : 'Copy ID'}
                </button>
              </div>
            )}
          </div>

          {/* Security & Access details */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Security & Activity
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border p-3" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-muted)' }}>
                <span className="block text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                  Failed Login Attempts
                </span>
                <span className="mt-0.5 font-semibold block" style={{ color: account.failed_login_attempts > 0 ? '#ef4444' : 'var(--text-primary)' }}>
                  {account.failed_login_attempts}
                </span>
              </div>

              <div className="rounded-xl border p-3" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-muted)' }}>
                <span className="block text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                  Locked Until
                </span>
                <span className="mt-0.5 font-semibold block" style={{ color: 'var(--text-primary)' }}>
                  {account.locked_until ? new Date(account.locked_until).toLocaleString() : 'None'}
                </span>
              </div>

              <div className="rounded-xl border p-3" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-muted)' }}>
                <span className="block text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                  Last Login
                </span>
                <span className="mt-0.5 font-semibold block" style={{ color: 'var(--text-primary)' }}>
                  {account.last_login_at ? new Date(account.last_login_at).toLocaleString() : 'Never'}
                </span>
              </div>

              <div className="rounded-xl border p-3" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-muted)' }}>
                <span className="block text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                  Account Created
                </span>
                <span className="mt-0.5 font-semibold block" style={{ color: 'var(--text-primary)' }}>
                  {new Date(account.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="border-t px-6 py-3 flex justify-end"
          style={{ borderColor: 'var(--border-default)', background: 'var(--bg-surface)' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-xs font-medium transition hover:bg-black/5 dark:hover:bg-white/5"
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
