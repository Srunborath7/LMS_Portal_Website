'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/src/shared/hooks/useLanguage';
import type { Locale } from '@/src/shared/providers/LanguageProvider';

const languages: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'km', label: 'ខ្មែរ', flag: '🇰🇭' },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = languages.find((l) => l.code === locale) ?? languages[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium transition-colors hover:bg-[var(--bg-surface-hover)]"
        style={{ color: 'var(--text-secondary)' }}
        aria-label="Switch language"
      >
        <span className="text-base">{current.flag}</span>
        <span className="hidden sm:inline">{current.code.toUpperCase()}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1.5 w-36 overflow-hidden rounded-lg border shadow-lg animate-fade-in-scale"
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--border-default)',
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLocale(lang.code);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-[var(--bg-surface-hover)]"
              style={{
                color: locale === lang.code ? 'var(--brand-accent)' : 'var(--text-primary)',
                fontWeight: locale === lang.code ? 600 : 400,
              }}
            >
              <span className="text-base">{lang.flag}</span>
              {lang.label}
              {locale === lang.code && (
                <svg className="ml-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5L20 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
