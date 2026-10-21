'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/src/shared/hooks/useLanguage';
import { useAuth } from '@/src/features/auth/useAuth';

export function UserMenu() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all hover:ring-2 hover:ring-[var(--brand-accent)]/30"
        style={{
          background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-light, #2a3a7a))',
          color: 'white',
        }}
        aria-label="User menu"
      >
        {initials}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border shadow-lg animate-fade-in-scale"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
        >
          {/* User info */}
          <div className="border-b px-4 py-3" style={{ borderColor: 'var(--border-default)' }}>
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {user?.name || 'User'}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>
              {user?.email || 'No email'}
            </p>
            {user?.role && (
              <span
                className="mt-1.5 inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize"
                style={{
                  background: 'var(--brand-accent)',
                  color: 'var(--brand-primary)',
                }}
              >
                {user.role}
              </span>
            )}
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            <button
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm transition-colors hover:bg-[var(--bg-surface-hover)]"
              style={{ color: 'var(--text-primary)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {t.topbar.profile}
            </button>
            <button
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm transition-colors hover:bg-[var(--bg-surface-hover)]"
              style={{ color: 'var(--text-primary)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
              {t.topbar.settings}
            </button>
          </div>

          {/* Logout */}
          <div className="border-t py-1.5" style={{ borderColor: 'var(--border-default)' }}>
            <button
              onClick={logout}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm transition-colors hover:bg-[var(--bg-surface-hover)]"
              style={{ color: 'var(--status-error)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              {t.topbar.signOut}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
