'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '@/src/shared/hooks/useLanguage';
import { authApi } from '@/src/services/auth/auth.api';
import type { AuthCreate, AuthOut } from '@/src/types/auth.types';
import { mockAuthAccounts } from '@/src/features/auth/mockData';
import { mockStudents } from '@/src/features/students/mockData';
import { mockTeachers } from '@/src/features/teachers/mockData';
import { AuthStatusBadge } from '@/src/features/auth/AuthStatusBadge';
import { AuthModal } from '@/src/features/auth/AuthModal';
import { AuthDetailModal } from '@/src/features/auth/AuthDetailModal';
import { Spinner } from '@/src/components/ui/Spinner';

export default function AuthAccountsPage() {
  const { t } = useLanguage();

  const [accounts, setAccounts] = useState<AuthOut[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'locked'>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AuthOut | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Banner
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  function showBanner(type: 'success' | 'error', message: string) {
    setBanner({ type, message });
    setTimeout(() => setBanner(null), 4000);
  }

  // Linked map helper: maps auth_id -> { type, name, code, email }
  const linkedProfilesMap = useMemo(() => {
    const map = new Map<string, { type: 'student' | 'teacher'; name: string; code: string; email: string }>();
    mockStudents.forEach((s) => {
      if (s.auth_id) {
        map.set(s.auth_id, {
          type: 'student',
          name: s.full_name,
          code: s.student_code,
          email: s.email,
        });
      }
    });
    mockTeachers.forEach((tch) => {
      if (tch.auth_id) {
        map.set(tch.auth_id, {
          type: 'teacher',
          name: tch.full_name,
          code: tch.teacher_code,
          email: tch.email,
        });
      }
    });
    return map;
  }, []);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authApi.list({
        q: search.trim() || undefined,
        is_active: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
        page,
        size: pageSize,
      });

      if (response && Array.isArray(response.items)) {
        setAccounts(response.items);
        setTotal(response.total);
        setIsUsingFallback(false);
      } else {
        throw new Error('Invalid response');
      }
    } catch {
      // Fallback to local mock data
      setIsUsingFallback(true);
      let filtered = [...mockAuthAccounts];

      if (search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (a) =>
            a.username.toLowerCase().includes(q) ||
            a.email.toLowerCase().includes(q) ||
            a.id.toLowerCase().includes(q)
        );
      }

      if (statusFilter === 'active') {
        filtered = filtered.filter((a) => a.is_active);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter((a) => !a.is_active);
      } else if (statusFilter === 'locked') {
        const now = new Date().toISOString();
        filtered = filtered.filter((a) => a.locked_until && a.locked_until > now);
      }

      setTotal(filtered.length);
      const start = (page - 1) * pageSize;
      setAccounts(filtered.slice(start, start + pageSize));
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page, pageSize]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  async function handleRegisterAccount(payload: AuthCreate) {
    try {
      if (!isUsingFallback) {
        const created = await authApi.register(payload);
        const fullAccount: AuthOut = {
          id: created.id,
          username: created.username,
          email: created.email,
          is_active: created.is_active,
          is_verified: created.is_verified,
          failed_login_attempts: 0,
          locked_until: null,
          last_login_at: null,
          created_at: created.created_at,
        };
        setAccounts((prev) => [fullAccount, ...prev]);
        setTotal((prev) => prev + 1);
      } else {
        const newAccount: AuthOut = {
          id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          username: payload.username,
          email: payload.email,
          is_active: true,
          is_verified: false,
          failed_login_attempts: 0,
          locked_until: null,
          last_login_at: null,
          created_at: new Date().toISOString(),
        };
        mockAuthAccounts.unshift(newAccount);
        setAccounts((prev) => [newAccount, ...prev]);
        setTotal((prev) => prev + 1);
      }
      showBanner('success', `Auth account ${payload.username} registered successfully.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to register account.';
      showBanner('error', msg);
      throw err;
    }
  }

  function handleCopyUuid(id: string) {
    navigator.clipboard.writeText(id);
    showBanner('success', `Auth ID copied: ${id}`);
  }

  // Stat metrics
  const stats = useMemo(() => {
    const list = isUsingFallback ? mockAuthAccounts : accounts;
    const totalCount = isUsingFallback ? mockAuthAccounts.length : total;
    const activeCount = list.filter((a) => a.is_active).length;
    const verifiedCount = list.filter((a) => a.is_verified).length;
    const linkedCount = list.filter((a) => linkedProfilesMap.has(a.id)).length;
    return {
      total: totalCount,
      active: activeCount,
      verified: verifiedCount,
      linked: linkedCount,
    };
  }, [accounts, total, isUsingFallback, linkedProfilesMap]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {banner && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-xl backdrop-blur-md animate-fade-in ${
            banner.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
              : 'border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-200'
          }`}
        >
          {banner.type === 'success' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-500">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-rose-500">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
          <span className="text-xs font-semibold">{banner.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Auth Accounts
          </h1>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
            Manage portal login accounts, credentials, and profile links for students and teachers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchAccounts}
            className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold shadow-xs transition hover:bg-black/5 dark:hover:bg-white/5"
            style={{
              borderColor: 'var(--border-default)',
              color: 'var(--text-primary)',
              background: 'var(--bg-surface)',
            }}
            title="Refresh accounts"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            Refresh
          </button>

          <button
            type="button"
            onClick={() => setIsRegisterOpen(true)}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:brightness-110 active:brightness-95"
            style={{ background: 'var(--brand-primary)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Register Account
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Total */}
        <div
          className="rounded-2xl border p-4 shadow-xs"
          style={{
            borderColor: 'var(--border-default)',
            background: 'var(--bg-surface)',
          }}
        >
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="text-xs font-medium">Total Accounts</span>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            {stats.total}
          </p>
        </div>

        {/* Active */}
        <div
          className="rounded-2xl border p-4 shadow-xs"
          style={{
            borderColor: 'var(--border-default)',
            background: 'var(--bg-surface)',
          }}
        >
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="text-xs font-medium">Active</span>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {stats.active}
          </p>
        </div>

        {/* Verified */}
        <div
          className="rounded-2xl border p-4 shadow-xs"
          style={{
            borderColor: 'var(--border-default)',
            background: 'var(--bg-surface)',
          }}
        >
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="text-xs font-medium">Email Verified</span>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-purple-600 dark:text-purple-400">
            {stats.verified}
          </p>
        </div>

        {/* Linked Records */}
        <div
          className="rounded-2xl border p-4 shadow-xs"
          style={{
            borderColor: 'var(--border-default)',
            background: 'var(--bg-surface)',
          }}
        >
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="text-xs font-medium">Linked Profiles</span>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
            {stats.linked}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
        style={{
          borderColor: 'var(--border-default)',
          background: 'var(--bg-surface)',
        }}
      >
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by username, email, or Auth UUID…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border pl-9 pr-3 py-2 text-xs outline-none transition focus:border-[var(--brand-primary)]"
            style={{
              borderColor: 'var(--border-default)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as typeof statusFilter);
              setPage(1);
            }}
            className="rounded-xl border px-3 py-2 text-xs outline-none transition focus:border-[var(--brand-primary)]"
            style={{
              borderColor: 'var(--border-default)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="locked">Locked Only</option>
          </select>

          {/* Page size */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-xl border px-3 py-2 text-xs outline-none transition focus:border-[var(--brand-primary)]"
            style={{
              borderColor: 'var(--border-default)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
            }}
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* Accounts Table */}
      <div
        className="overflow-hidden rounded-2xl border shadow-xs"
        style={{
          borderColor: 'var(--border-default)',
          background: 'var(--bg-surface)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr
                className="border-b text-[11px] font-semibold uppercase tracking-wider"
                style={{
                  borderColor: 'var(--border-default)',
                  background: 'var(--bg-muted)',
                  color: 'var(--text-secondary)',
                }}
              >
                <th className="px-4 py-3 sm:px-6">User / Account</th>
                <th className="px-4 py-3 sm:px-6">Auth ID (UUID)</th>
                <th className="px-4 py-3 sm:px-6">Status</th>
                <th className="px-4 py-3 sm:px-6">Linked Profile</th>
                <th className="px-4 py-3 sm:px-6">Last Login</th>
                <th className="px-4 py-3 text-right sm:px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-default)' }}>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <div className="flex items-center justify-center gap-2">
                      <Spinner size={18} />
                      <span>Loading accounts…</span>
                    </div>
                  </td>
                </tr>
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
                    No auth accounts found. Register an account or adjust your search.
                  </td>
                </tr>
              ) : (
                accounts.map((acc) => {
                  const linked = linkedProfilesMap.get(acc.id);
                  const isLocked = Boolean(acc.locked_until && new Date(acc.locked_until) > new Date());
                  const initials = acc.username.slice(0, 2).toUpperCase();

                  return (
                    <tr
                      key={acc.id}
                      className="transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                    >
                      {/* User */}
                      <td className="px-4 py-3.5 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-bold text-white shadow-xs"
                            style={{
                              background: 'linear-gradient(135deg, var(--brand-primary), #2b3d82)',
                            }}
                          >
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                              {acc.username}
                            </p>
                            <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                              {acc.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Auth ID */}
                      <td className="px-4 py-3.5 sm:px-6">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--text-secondary)]">
                          <span className="truncate max-w-[140px] sm:max-w-[200px]" title={acc.id}>
                            {acc.id}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyUuid(acc.id)}
                            className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10 shrink-0"
                            title="Copy UUID to link with Student or Teacher"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 sm:px-6">
                        <AuthStatusBadge
                          isActive={acc.is_active}
                          isVerified={acc.is_verified}
                          isLocked={isLocked}
                        />
                      </td>

                      {/* Linked Profile */}
                      <td className="px-4 py-3.5 sm:px-6">
                        {linked ? (
                          <div className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px]" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-muted)' }}>
                            <span
                              className={`h-2 w-2 rounded-full ${
                                linked.type === 'student' ? 'bg-[#1E2A5A]' : 'bg-[#F2B134]'
                              }`}
                            />
                            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {linked.type === 'student' ? 'Student' : 'Teacher'}: {linked.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] italic" style={{ color: 'var(--text-tertiary)' }}>
                            Unlinked
                          </span>
                        )}
                      </td>

                      {/* Last Login */}
                      <td className="px-4 py-3.5 sm:px-6" style={{ color: 'var(--text-secondary)' }}>
                        {acc.last_login_at
                          ? new Date(acc.last_login_at).toLocaleDateString()
                          : 'Never'}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right sm:px-6">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAccount(acc);
                            setIsDetailOpen(true);
                          }}
                          className="rounded-lg border px-2.5 py-1 text-xs font-semibold transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
                          style={{
                            borderColor: 'var(--border-default)',
                            color: 'var(--text-primary)',
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div
          className="flex flex-col items-center justify-between gap-3 border-t px-4 py-3 sm:flex-row sm:px-6"
          style={{ borderColor: 'var(--border-default)', background: 'var(--bg-surface)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Showing{' '}
            <span className="font-semibold text-[var(--text-primary)]">
              {total === 0 ? 0 : (page - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-[var(--text-primary)]">
              {Math.min(page * pageSize, total)}
            </span>{' '}
            of <span className="font-semibold text-[var(--text-primary)]">{total}</span> accounts
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40"
              style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
            >
              Previous
            </button>
            <span className="px-2 text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40"
              style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Register Auth Modal */}
      <AuthModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSave={handleRegisterAccount}
      />

      {/* Detail Modal */}
      <AuthDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        account={selectedAccount}
        linkedInfo={selectedAccount ? linkedProfilesMap.get(selectedAccount.id) : null}
      />
    </div>
  );
}
