'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/src/shared/hooks/useLanguage';
import { RegisterForm } from '@/src/features/auth/RegisterForm';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';
import { LanguageSwitcher } from '@/src/components/ui/LanguageSwitcher';

export default function RegisterPage() {
  const { t } = useLanguage();
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]" style={{ background: 'var(--bg-surface)' }}>
      {/* Brand panel */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-[#1E2A5A] p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#F2B134] text-[#1E2A5A]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M2 8l10-5 10 5-10 5L2 8z" />
              <path d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">{t.appName}</span>
        </div>

        <div className="max-w-md">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            {t.auth.registerHeading}
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-white/70">
            {t.auth.registerSubtext}
          </p>

          <ul className="mt-10 space-y-6">
            {t.auth.perks.map((p) => (
              <li key={p.title} className="flex gap-4">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#F2B134] text-[#1E2A5A]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <div>
                  <p className="font-semibold">{p.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-white/65">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-white/50">
          © {year ?? ''} {t.appName}. All rights reserved.
        </p>

        {/* Decorative circles */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#F2B134]/5" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-[#F2B134]/5" />
      </section>

      {/* Form panel */}
      <section className="flex flex-col">
        {/* Top bar with theme toggle and language switcher */}
        <div className="flex items-center justify-end gap-2 px-6 pt-4">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
          <RegisterForm />
        </div>
      </section>
    </main>
  );
}
