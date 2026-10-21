'use client';

import { useLanguage } from '@/src/shared/hooks/useLanguage';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';
import { LanguageSwitcher } from '@/src/components/ui/LanguageSwitcher';
import { UserMenu } from '@/src/components/layout/UserMenu';

interface TopbarProps {
  collapsed?: boolean;
  onMenuToggle: () => void;
}

export function Topbar({ collapsed: _collapsed, onMenuToggle }: TopbarProps) {
  const { t } = useLanguage();

  return (
    <header
      className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b px-4 lg:px-6 transition-colors duration-200"
      style={{
        background: 'var(--bg-surface)',
        borderColor: 'var(--border-default)',
      }}
    >
      {/* Left: Mobile menu + search */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-surface-hover)]"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Search */}
        <div
          className="hidden sm:flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors focus-within:border-[var(--border-focus)] focus-within:ring-4 focus-within:ring-[var(--brand-primary)]/10"
          style={{
            background: 'var(--bg-muted)',
            borderColor: 'var(--border-default)',
            minWidth: '280px',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder={t.topbar.searchPlaceholder}
            className="w-full bg-transparent text-sm outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
          <kbd
            className="hidden lg:inline-flex h-5 items-center rounded border px-1.5 text-[10px] font-medium"
            style={{
              borderColor: 'var(--border-default)',
              color: 'var(--text-tertiary)',
              background: 'var(--bg-surface)',
            }}
          >
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />

        {/* Notifications */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-surface-hover)]"
          style={{ color: 'var(--text-secondary)' }}
          aria-label={t.topbar.notifications}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          {/* Notification dot */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--status-error)] animate-pulse-glow" />
        </button>

        {/* Divider */}
        <div className="mx-1 h-6 w-px" style={{ background: 'var(--border-default)' }} />

        <UserMenu />
      </div>
    </header>
  );
}
