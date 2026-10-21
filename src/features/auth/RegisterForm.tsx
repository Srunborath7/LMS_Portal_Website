'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/src/shared/hooks/useLanguage';
import { useAuth } from '@/src/features/auth/useAuth';
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

export function RegisterForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const { register, loading, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [agree, setAgree] = useState(false);
  const [localError, setLocalError] = useState('');

  const displayError = localError || error;
  const score = useMemo(() => scorePassword(password), [password]);

  const strengthLabels = [t.auth.tooShort, t.auth.weak, t.auth.fair, t.auth.good, t.auth.strong];

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (name.trim().length < 2) return setLocalError(t.auth.validName);
    if (!/^\S+@\S+\.\S+$/.test(email)) return setLocalError(t.auth.validEmail);
    if (password.length < 8) return setLocalError(t.auth.passwordMin);
    if (password !== confirm) return setLocalError(t.auth.passwordMismatch);
    if (!agree) return setLocalError(t.auth.acceptTerms);

    const success = await register({ username: name, email, password });
    if (success) {
      router.push('/auth/login');
    }
  }

  const inputClass =
    'mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-[15px] outline-none transition focus:border-[var(--brand-primary)] focus:ring-4 focus:ring-[var(--brand-primary)]/20';
  const labelClass = 'text-sm font-medium';

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
        <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          {t.appName}
        </span>
      </div>

      <h2 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
        {t.auth.signUp}
      </h2>
      <p className="mt-1.5 text-[15px]" style={{ color: 'var(--text-secondary)' }}>
        {t.auth.takeAMinute}
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-7 space-y-5">
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

        {/* Name */}
        <div>
          <label htmlFor="reg-name" className={labelClass} style={{ color: 'var(--text-secondary)' }}>
            {t.auth.fullName}
          </label>
          <input
            id="reg-name"
            type="text"
            autoComplete="name"
            placeholder={t.auth.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            style={{ borderColor: 'var(--border-default)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="reg-email" className={labelClass} style={{ color: 'var(--text-secondary)' }}>
            {t.auth.email}
          </label>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            placeholder={t.auth.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            style={{ borderColor: 'var(--border-default)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="reg-password" className={labelClass} style={{ color: 'var(--text-secondary)' }}>
            {t.auth.password}
          </label>
          <div className="relative">
            <input
              id="reg-password"
              type={show ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder={t.auth.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} pr-16`}
              style={{ borderColor: 'var(--border-default)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
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

          {password && (
            <div className="mt-2.5" aria-live="polite">
              <div className="grid grid-cols-4 gap-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 rounded-full transition-colors"
                    style={{ background: i <= score ? strengthColor[score] : 'var(--border-default)' }}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {t.auth.strength}: {strengthLabels[score]}. {t.auth.strengthHint}
              </p>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="reg-confirm" className={labelClass} style={{ color: 'var(--text-secondary)' }}>
            {t.auth.confirmPassword}
          </label>
          <input
            id="reg-confirm"
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder={t.auth.confirmPlaceholder}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={inputClass}
            style={{ borderColor: 'var(--border-default)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
          />
        </div>

        {/* Terms */}
        <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--border-strong)] bg-[var(--bg-input)] accent-[var(--brand-primary)] cursor-pointer"
          />
          <span>
            {t.auth.agreeTerms}{' '}
            <a href="/terms" className="font-medium transition-colors hover:underline" style={{ color: 'var(--brand-primary)' }}>
              {t.auth.termsOfService}
            </a>{' '}
            {t.auth.and}{' '}
            <a href="/privacy" className="font-medium transition-colors hover:underline" style={{ color: 'var(--brand-primary)' }}>
              {t.auth.privacyPolicy}
            </a>
            .
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-[15px] font-semibold text-white shadow-md transition hover:brightness-110 active:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--brand-primary)]/30 disabled:cursor-not-allowed disabled:opacity-70"
          style={{ background: 'var(--brand-primary)' }}
        >
          {loading && <Spinner size={16} />}
          {loading ? t.auth.creatingAccount : t.auth.signUp}
        </button>
      </form>

      <p className="mt-8 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
        {t.auth.hasAccount}{' '}
        <a href="/auth/login" className="font-semibold transition-colors hover:underline" style={{ color: 'var(--brand-primary)' }}>
          {t.auth.signIn}
        </a>
      </p>
    </div>
  );
}
