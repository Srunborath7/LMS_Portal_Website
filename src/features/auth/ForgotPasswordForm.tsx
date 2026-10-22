'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/src/shared/hooks/useLanguage';
import { authApi } from '@/src/services/auth/auth.api';
import { Spinner } from '@/src/components/ui/Spinner';

export function ForgotPasswordForm() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError(t.auth.validEmail);
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setError(t.auth.validEmail);
      return;
    }

    setLoading(true);
    try {
      await authApi.forgotPassword({ email: cleanEmail });
      setSubmitted(true);
    } catch (err: unknown) {
      // In local development or backend without email sending, allow testing flow
      const msg = err instanceof Error ? err.message : 'Failed to send reset link.';
      // If error is 404 or backend not found, display message but still allow user to proceed
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-[15px] outline-none transition focus:border-[var(--brand-primary)] focus:ring-4 focus:ring-[var(--brand-primary)]/20';

  if (submitted) {
    return (
      <div className="w-full max-w-[420px] text-center animate-fade-in">
        {/* Email Icon */}
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {t.auth.resetEmailSentTitle}
        </h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {t.auth.resetEmailSentText}
        </p>
        <p className="mt-2 font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
          {email}
        </p>

        <div className="mt-8 space-y-3">
          <Link
            href={`/auth/reset-password?email=${encodeURIComponent(email)}`}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-[15px] font-semibold text-white shadow-md transition hover:brightness-110 active:brightness-95"
            style={{ background: 'var(--brand-primary)' }}
          >
            Enter Reset Token
          </Link>

          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="w-full rounded-lg border py-2.5 text-sm font-semibold transition hover:bg-black/5 dark:hover:bg-white/5"
            style={{
              borderColor: 'var(--border-default)',
              color: 'var(--text-secondary)',
            }}
          >
            Try another email
          </button>
        </div>

        <div className="mt-8">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm font-medium transition hover:underline"
            style={{ color: 'var(--brand-primary)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {t.auth.backToSignIn}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[420px]">
      {/* Mobile logo */}
      <div className="mb-8 flex items-center gap-2.5 lg:hidden">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#F2B134] text-[#1E2A5A]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M2 8l10-5 10 5-10 5L2 8z" />
            <path d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" />
          </svg>
        </div>
        <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
          {t.appName}
        </span>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: 'var(--text-primary)' }}>
          {t.auth.forgotHeading}
        </h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {t.auth.forgotSubtext}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-lg border px-3.5 py-2.5 text-sm"
          style={{
            borderColor: 'var(--status-error)',
            background: 'var(--status-error-bg)',
            color: 'var(--status-error)',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="forgot-email" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {t.auth.email}
          </label>
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder={t.auth.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
            style={{
              borderColor: 'var(--border-default)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-[15px] font-semibold text-white shadow-md transition hover:brightness-110 active:brightness-95 disabled:opacity-50"
          style={{ background: 'var(--brand-primary)' }}
        >
          {loading && <Spinner size={16} />}
          {loading ? t.auth.sendingResetLink : t.auth.sendResetLink}
        </button>

        <div className="pt-2 text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm font-medium transition hover:underline"
            style={{ color: 'var(--brand-primary)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {t.auth.backToSignIn}
          </Link>
        </div>
      </form>
    </div>
  );
}
