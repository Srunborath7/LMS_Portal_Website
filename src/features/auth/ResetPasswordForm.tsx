'use client';

import { useState, useMemo, useEffect, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/src/shared/hooks/useLanguage';
import { authApi } from '@/src/services/auth/auth.api';
import { Spinner } from '@/src/components/ui/Spinner';

function scorePassword(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p) || p.length >= 14) s++;
  return s;
}

const strengthColor = [
  'var(--border-strong)',
  'var(--status-error)',
  'var(--brand-accent)',
  'var(--status-success)',
  '#059669',
];

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';
  const emailFromUrl = searchParams.get('email') || '';

  const { t } = useLanguage();
  const [token, setToken] = useState(tokenFromUrl);
  const [email, setEmail] = useState(emailFromUrl);
  const [showManualToken, setShowManualToken] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Keep state in sync with URL parameters
  useEffect(() => {
    const qToken = searchParams.get('token');
    const qEmail = searchParams.get('email');
    if (qToken) setToken(qToken);
    if (qEmail) setEmail(qEmail);
  }, [searchParams]);

  const score = useMemo(() => scorePassword(newPassword), [newPassword]);
  const strengthLabels = [t.auth.tooShort, t.auth.weak, t.auth.fair, t.auth.good, t.auth.strong];

  const hasTokenFromUrl = Boolean(tokenFromUrl && tokenFromUrl.length >= 10);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const cleanToken = token.trim();
    if (!cleanToken) {
      setError('Please provide the reset token.');
      return;
    }
    if (cleanToken.length < 20) {
      setError('Reset token must be at least 20 characters long.');
      return;
    }
    if (newPassword.length < 8) {
      setError(t.auth.passwordMin);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t.auth.passwordMismatch);
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({
        token: cleanToken,
        new_password: newPassword,
      });
      setSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reset password. The link or token may be expired.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-[15px] outline-none transition focus:border-[var(--brand-primary)] focus:ring-4 focus:ring-[var(--brand-primary)]/20';

  if (success) {
    return (
      <div className="w-full max-w-[420px] text-center animate-fade-in">
        {/* Success Icon */}
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {t.auth.resetSuccessTitle}
        </h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {t.auth.resetSuccessText}
        </p>

        <div className="mt-8">
          <Link
            href="/auth/login"
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-[15px] font-semibold text-white shadow-md transition hover:brightness-110 active:brightness-95"
            style={{ background: 'var(--brand-primary)' }}
          >
            {t.auth.signIn}
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
          {t.auth.resetHeading}
        </h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {t.auth.resetSubtext}
          {email && (
            <span className="block mt-1 font-semibold text-[var(--text-primary)]">
              Account: {email}
            </span>
          )}
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
        {/* Token Card / Input */}
        {hasTokenFromUrl && !showManualToken ? (
          <div
            className="rounded-xl border p-3.5"
            style={{
              borderColor: 'var(--border-default)',
              background: 'var(--bg-muted, rgba(30, 42, 90, 0.04))',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Reset link verified
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowManualToken(true)}
                className="text-[11px] font-medium text-[var(--text-secondary)] hover:underline"
              >
                Change
              </button>
            </div>
            <p className="mt-1 font-mono text-[11px] text-[var(--text-secondary)] truncate">
              Token: {token.slice(0, 12)}…{token.slice(-8)}
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="reset-token" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                {t.auth.token} <span className="text-red-500">*</span>
              </label>
              {hasTokenFromUrl && (
                <button
                  type="button"
                  onClick={() => setShowManualToken(false)}
                  className="text-xs font-medium hover:underline"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  Use link token
                </button>
              )}
            </div>
            <input
              id="reset-token"
              type="text"
              required
              minLength={20}
              placeholder={t.auth.tokenPlaceholder}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className={`${inputClass} font-mono text-xs`}
              style={{
                borderColor: 'var(--border-default)',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        )}

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="reset-password" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {t.auth.newPassword} <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs font-medium hover:underline"
              style={{ color: 'var(--brand-primary)' }}
            >
              {showPassword ? t.auth.hide : t.auth.show}
            </button>
          </div>
          <input
            id="reset-password"
            type={showPassword ? 'text' : 'password'}
            required
            minLength={8}
            placeholder={t.auth.passwordPlaceholder}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputClass}
            style={{
              borderColor: 'var(--border-default)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
            }}
          />

          {/* Password strength meter */}
          {newPassword && (
            <div className="mt-2.5 animate-fade-in">
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: 'var(--text-secondary)' }}>{t.auth.strength}:</span>
                <span className="font-medium" style={{ color: strengthColor[score] }}>
                  {strengthLabels[score]}
                </span>
              </div>
              <div className="mt-1.5 flex h-1.5 gap-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
                {[0, 1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className="flex-1 transition-all duration-300"
                    style={{
                      background: step < score ? strengthColor[score] : 'transparent',
                    }}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-[11px] leading-tight" style={{ color: 'var(--text-tertiary)' }}>
                {t.auth.strengthHint}
              </p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirm-new-password" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {t.auth.confirmNewPassword} <span className="text-red-500">*</span>
          </label>
          <input
            id="confirm-new-password"
            type={showPassword ? 'text' : 'password'}
            required
            placeholder={t.auth.confirmPlaceholder}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? t.auth.resettingButton : t.auth.resetButton}
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
