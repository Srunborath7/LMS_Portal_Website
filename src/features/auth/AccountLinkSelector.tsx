'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { AuthOut } from '@/src/types/auth.types';
import { authApi } from '@/src/services/auth/auth.api';
import { mockAuthAccounts } from '@/src/features/auth/mockData';

interface AccountLinkSelectorProps {
  selectedAuthId: string | null;
  onChange: (authId: string | null) => void;
  suggestedEmail?: string;
}

export function AccountLinkSelector({
  selectedAuthId,
  onChange,
  suggestedEmail,
}: AccountLinkSelectorProps) {
  const [accounts, setAccounts] = useState<AuthOut[]>(mockAuthAccounts);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'dropdown' | 'manual'>('dropdown');
  const [manualId, setManualId] = useState(selectedAuthId || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Sync manual input if selectedAuthId changes externally
  useEffect(() => {
    setManualId(selectedAuthId || '');
  }, [selectedAuthId]);

  // Fetch accounts from API with fallback to mock
  useEffect(() => {
    let mounted = true;
    async function loadAccounts() {
      setLoading(true);
      try {
        const res = await authApi.list({ size: 100 });
        if (mounted && res && Array.isArray(res.items) && res.items.length > 0) {
          setAccounts(res.items);
        }
      } catch {
        // Fallback to local mock data
        if (mounted) setAccounts(mockAuthAccounts);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadAccounts();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedAccount = useMemo(() => {
    if (!selectedAuthId) return null;
    return accounts.find((a) => a.id === selectedAuthId) || null;
  }, [selectedAuthId, accounts]);

  const matchingAccount = useMemo(() => {
    if (!suggestedEmail || !suggestedEmail.trim()) return null;
    const cleanEmail = suggestedEmail.trim().toLowerCase();
    return accounts.find((a) => a.email.toLowerCase() === cleanEmail) || null;
  }, [suggestedEmail, accounts]);

  const filteredAccounts = useMemo(() => {
    if (!searchQuery.trim()) return accounts;
    const q = searchQuery.toLowerCase();
    return accounts.filter(
      (a) =>
        a.username.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
    );
  }, [accounts, searchQuery]);

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSelect(id: string) {
    onChange(id);
  }

  function handleUnlink() {
    onChange(null);
    setManualId('');
  }

  function handleManualApply() {
    const trimmed = manualId.trim();
    if (trimmed) {
      onChange(trimmed);
    } else {
      onChange(null);
    }
  }

  const isValidUuid = (id: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  return (
    <div className="space-y-4">
      {/* Current Link Status Card */}
      <div
        className="rounded-xl border p-4 transition-all"
        style={{
          background: selectedAuthId
            ? 'var(--bg-card, rgba(30, 42, 90, 0.03))'
            : 'var(--bg-input, transparent)',
          borderColor: selectedAuthId ? 'var(--brand-primary)' : 'var(--border-default)',
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl font-semibold shadow-xs"
              style={{
                background: selectedAuthId
                  ? 'linear-gradient(135deg, #1E2A5A, #2b3d82)'
                  : 'var(--border-default)',
                color: selectedAuthId ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              {selectedAuthId ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                  <line x1="12" y1="2" x2="12" y2="12" />
                </svg>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Account Link Status
                </span>
                {selectedAuthId ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Linked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-500/10 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                    Unlinked (No portal login)
                  </span>
                )}
              </div>

              {selectedAuthId ? (
                <div className="mt-1">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {selectedAccount?.username || 'Custom Auth User'}
                    {selectedAccount?.email && (
                      <span className="ml-2 font-normal text-xs text-[var(--text-secondary)]">
                        ({selectedAccount.email})
                      </span>
                    )}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 font-mono text-xs text-[var(--text-secondary)]">
                    <span>ID: {selectedAuthId}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedAuthId)}
                      className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10"
                      title="Copy Auth ID"
                    >
                      {copied ? (
                        <span className="text-emerald-500 text-[10px]">Copied!</span>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                  Link this record to an Auth user account so they can log into the portal.
                </p>
              )}
            </div>
          </div>

          {selectedAuthId && (
            <button
              type="button"
              onClick={handleUnlink}
              className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-500/10 dark:text-rose-400"
              style={{ borderColor: 'var(--border-default)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Unlink
            </button>
          )}
        </div>
      </div>

      {/* Suggested match banner */}
      {matchingAccount && matchingAccount.id !== selectedAuthId && (
        <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>
              Found matching user <strong>{matchingAccount.username}</strong> with email <strong>{matchingAccount.email}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleSelect(matchingAccount.id)}
            className="rounded-md bg-amber-600 px-2.5 py-1 font-semibold text-white transition hover:bg-amber-700"
          >
            Quick Link
          </button>
        </div>
      )}

      {/* Selection Mode Tabs */}
      <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: 'var(--border-default)' }}>
        <button
          type="button"
          onClick={() => setMode('dropdown')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            mode === 'dropdown'
              ? 'bg-[var(--brand-primary)] text-white shadow-xs'
              : 'text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
          Select from Auth Users
        </button>

        <button
          type="button"
          onClick={() => setMode('manual')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            mode === 'manual'
              ? 'bg-[var(--brand-primary)] text-white shadow-xs'
              : 'text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          Manual UUID / Auth ID
        </button>
      </div>

      {/* Mode 1: Searchable Dropdown / List */}
      {mode === 'dropdown' && (
        <div className="space-y-2">
          <div className="relative">
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
              placeholder="Filter by username, email, or UUID…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border pl-9 pr-3 py-2 text-xs outline-none transition focus:border-[var(--brand-primary)]"
              style={{
                borderColor: 'var(--border-default)',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div
            className="max-h-48 overflow-y-auto rounded-xl border divide-y"
            style={{
              borderColor: 'var(--border-default)',
              background: 'var(--bg-surface)',
            }}
          >
            {loading ? (
              <div className="p-4 text-center text-xs text-[var(--text-secondary)]">
                Loading accounts…
              </div>
            ) : filteredAccounts.length === 0 ? (
              <div className="p-4 text-center text-xs text-[var(--text-secondary)]">
                No auth accounts match your query.
              </div>
            ) : (
              filteredAccounts.map((acc) => {
                const isSelected = selectedAuthId === acc.id;
                return (
                  <div
                    key={acc.id}
                    onClick={() => handleSelect(acc.id)}
                    className={`flex items-center justify-between p-2.5 text-xs cursor-pointer transition ${
                      isSelected
                        ? 'bg-[var(--brand-primary)]/10 font-semibold'
                        : 'hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[var(--text-primary)] truncate">
                          {acc.username}
                        </span>
                        {acc.is_active ? (
                          <span className="rounded bg-emerald-500/10 px-1 py-0.2 text-[10px] text-emerald-600 dark:text-emerald-400">
                            Active
                          </span>
                        ) : (
                          <span className="rounded bg-rose-500/10 px-1 py-0.2 text-[10px] text-rose-500">
                            Inactive
                          </span>
                        )}
                        {acc.is_verified && (
                          <span className="text-[10px] text-blue-500" title="Verified">✓</span>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] truncate">
                        {acc.email}
                      </p>
                      <p className="font-mono text-[10px] text-[var(--text-secondary)] opacity-70 truncate">
                        {acc.id}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {isSelected ? (
                        <span className="rounded-full bg-[var(--brand-primary)] p-1 text-white">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="rounded-md border px-2 py-0.5 text-[11px] text-[var(--text-secondary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
                          style={{ borderColor: 'var(--border-default)' }}
                        >
                          Select
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Manual UUID Entry */}
      {mode === 'manual' && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[var(--text-secondary)]">
            Auth ID (UUID string)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. 3fa85f64-5717-4562-b3fc-2c963f66afa6"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              className="flex-1 rounded-lg border px-3 py-2 font-mono text-xs outline-none transition focus:border-[var(--brand-primary)]"
              style={{
                borderColor: manualId && !isValidUuid(manualId) ? '#ef4444' : 'var(--border-default)',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
              }}
            />
            <button
              type="button"
              onClick={handleManualApply}
              className="rounded-lg bg-[var(--brand-primary)] px-3 py-2 text-xs font-semibold text-white shadow-xs transition hover:opacity-90"
            >
              Apply
            </button>
          </div>
          {manualId && !isValidUuid(manualId) && (
            <p className="text-[11px] text-rose-500">
              Please enter a valid UUID format (e.g. 3fa85f64-5717-4562-b3fc-2c963f66afa6).
            </p>
          )}
          <p className="text-[11px] text-[var(--text-secondary)]">
            You can paste an existing account&apos;s UUID directly to link it to this record.
          </p>
        </div>
      )}
    </div>
  );
}
