'use client';

import React, { useState } from 'react';
import type { AuthCreate, AuthOut } from '@/src/types/auth.types';
import { Spinner } from '@/src/components/ui/Spinner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: AuthCreate) => Promise<AuthOut | void>;
}

export function AuthModal({ isOpen, onClose, onSave }: AuthModalProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  function validate(): string | null {
    if (!username.trim()) return 'Username is required.';
    if (username.trim().length < 3) return 'Username must be at least 3 characters.';
    if (!/^[a-zA-Z0-9._-]+$/.test(username.trim())) {
      return 'Username can only contain letters, numbers, dots, underscores, and dashes.';
    }
    if (!email.trim()) return 'Email is required.';
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Please provide a valid email address.';
    if (!password) return 'Password is required.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const valErr = validate();
    if (valErr) {
      setError(valErr);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await onSave({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      // reset form
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to register account. Please check the fields.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full rounded-lg border px-3.5 py-2 text-sm outline-none transition focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className="relative z-10 flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border shadow-2xl animate-fade-in-scale"
        style={{
          background: 'var(--bg-surface)',
          borderColor: 'var(--border-default)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="grid h-10 w-10 place-items-center rounded-xl text-white shadow-xs"
              style={{ background: 'var(--brand-primary)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                Register Auth Account
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Create new portal login credentials
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div
              className="rounded-lg border px-3.5 py-2.5 text-xs font-medium animate-fade-in"
              style={{
                borderColor: 'var(--status-error)',
                background: 'var(--status-error-bg)',
                color: 'var(--status-error)',
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. sokha.chan"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
              style={{
                borderColor: 'var(--border-default)',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="e.g. sokha.chan@student.edu.kh"
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
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Password <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] font-medium hover:underline"
                style={{ color: 'var(--brand-primary)' }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              style={{
                borderColor: 'var(--border-default)',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Re-enter password"
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

          <div
            className="rounded-xl border p-3 text-[11px]"
            style={{
              borderColor: 'var(--border-default)',
              background: 'var(--bg-muted)',
              color: 'var(--text-secondary)',
            }}
          >
            Registered accounts receive a unique UUID (Auth ID) which can be linked to Students or Teachers for portal login.
          </div>

          {/* Action Buttons */}
          <div
            className="flex items-center justify-end gap-2 border-t pt-4"
            style={{ borderColor: 'var(--border-default)' }}
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-semibold text-white shadow-md transition hover:brightness-110 active:brightness-95 disabled:opacity-50"
              style={{ background: 'var(--brand-primary)' }}
            >
              {loading && <Spinner size={14} />}
              Register Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
