'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/src/shared/hooks/useLanguage';
import { useAuth } from '@/src/features/auth/useAuth';
import { Spinner } from '@/src/components/ui/Spinner';

export function LoginForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const { login, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [localError, setLocalError] = useState('');

  const displayError = localError || error;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setLocalError(t.auth.validEmail);
      return;
    }
    if (password.length < 8) {
      setLocalError(t.auth.passwordMin);
      return;
    }

    const success = await login({ email, password });
    if (success) {
      router.push('/dashboard');
    }
  }

  const inputClass =
    'mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-[15px] outline-none transition focus:border-[var(--brand-primary)] focus:ring-4 focus:ring-[var(--brand-primary)]/20';

  return (
    <div className="w-full max-w-[400px]">
      {/* Mobile logo */}
      <div className="mb-8 flex items-center gap-2.5 lg:hidden">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#F2B134] text-[#1E2A5A]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M2 8l10-5 10 5-10 5L2 8z" />
            <path d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" />
          </svg>
        </div>
        <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          {t.appName}
        </span>
      </div>

      <h2
        className="text-2xl font-semibold tracking-tight"
        style={{ color: 'var(--text-primary)' }}
      >
        {t.auth.signIn}
      </h2>
      <p className="mt-1.5 text-[15px]" style={{ color: 'var(--text-secondary)' }}>
        {t.auth.useSchoolAccount}
      </p>

      {/* Google SSO */}
      <button
        type="button"
        className="mt-7 flex w-full items-center justify-center gap-3 rounded-lg border px-4 py-2.5 text-[15px] font-medium transition hover:bg-[var(--bg-surface-hover)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--brand-primary)]/20"
        style={{
          borderColor: 'var(--border-default)',
          background: 'var(--bg-surface)',
          color: 'var(--text-primary)',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
          <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.2C12.4 13.6 17.7 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
          <path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.2C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.9-6.2z" />
          <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.9l-7.9 6.2C6.5 42.6 14.6 48 24 48z" />
        </svg>
        {t.auth.continueGoogle}
      </button>

      <div className="my-6 flex items-center gap-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>
        <span className="h-px flex-1" style={{ background: 'var(--border-default)' }} />
        {t.auth.orUseEmail}
        <span className="h-px flex-1" style={{ background: 'var(--border-default)' }} />
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {displayError && (
          <div
            role="alert"
            className="rounded-lg border px-3.5 py-2.5 text-sm"
            style={{
              borderColor: 'var(--status-error)',
              background: 'var(--status-error-bg)',
              color: 'var(--status-error)',
            }}
          >
            {displayError}
          </div>
        )}

        <div>
          <label htmlFor="login-email" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {t.auth.email}
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder={t.auth.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            style={{
              borderColor: 'var(--border-default)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {t.auth.password}
            </label>
            <a href="/forgot-password" className="text-sm font-medium transition-colors hover:underline" style={{ color: 'var(--brand-primary)' }}>
              {t.auth.forgotPassword}
            </a>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder={t.auth.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} pr-16`}
              style={{
                borderColor: 'var(--border-default)',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
              }}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-pressed={show}
              className="absolute right-2 top-[calc(0.375rem+0.25rem)] rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors hover:text-[var(--text-primary)] focus-visible:outline-none"
              style={{ color: 'var(--text-secondary)' }}
            >
              {show ? t.auth.hide : t.auth.show}
            </button>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-[var(--border-strong)] bg-[var(--bg-input)] accent-[var(--brand-primary)] cursor-pointer"
          />
          {t.auth.rememberMe}
        </label>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-[15px] font-semibold text-white shadow-md transition hover:brightness-110 active:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--brand-primary)]/30 disabled:cursor-not-allowed disabled:opacity-70"
          style={{ background: 'var(--brand-primary)' }}
        >
          {loading && <Spinner size={16} />}
          {loading ? t.auth.signingIn : t.auth.signIn}
        </button>
      </form>

      <p className="mt-8 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
        {t.auth.noAccount}{' '}
        <a href="/auth/register" className="font-semibold transition-colors hover:underline" style={{ color: 'var(--brand-primary)' }}>
          {t.auth.createAccount}
        </a>
      </p>
    </div>
  );
}
