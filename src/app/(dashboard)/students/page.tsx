'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '@/src/shared/hooks/useLanguage';
import { studentsApi } from '@/src/services/students/students.api';
import type {
  Gender,
  StudentCreate,
  StudentOut,
  StudentStatus,
  StudentUpdate,
} from '@/src/services/students/students.types';
import { mockStudents } from '@/src/features/students/mockData';
import { StudentStatusBadge } from '@/src/features/students/StudentStatusBadge';
import { StudentModal } from '@/src/features/students/StudentModal';
import { StudentDetailModal } from '@/src/features/students/StudentDetailModal';
import { Spinner } from '@/src/components/ui/Spinner';
import { toLocalDisplay } from '@/src/shared/utils/phone';

export default function StudentsPage() {
  const { t } = useLanguage();

  const [students, setStudents] = useState<StudentOut[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StudentStatus | 'all'>('all');
  const [genderFilter, setGenderFilter] = useState<Gender | 'all'>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentOut | null>(null);

  // Detail Modal state
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<StudentOut | null>(null);

  // Delete confirm state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Success / error banner
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await studentsApi.list({
        q: search.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        gender: genderFilter !== 'all' ? genderFilter : undefined,
        page,
        size: pageSize,
      });

      if (response && Array.isArray(response.items)) {
        setStudents(response.items);
        setTotal(response.total);
        setIsUsingFallback(false);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch {
      // Backend may be unauthenticated or empty during local development;
      // Filter mock students locally so the UI remains completely interactive.
      setIsUsingFallback(true);
      let filtered = [...mockStudents];

      if (search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.full_name.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q) ||
            s.student_code.toLowerCase().includes(q) ||
            (s.phone && s.phone.includes(q))
        );
      }

      if (statusFilter !== 'all') {
        filtered = filtered.filter((s) => s.status === statusFilter);
      }

      if (genderFilter !== 'all') {
        filtered = filtered.filter((s) => s.gender === genderFilter);
      }

      setTotal(filtered.length);
      const start = (page - 1) * pageSize;
      setStudents(filtered.slice(start, start + pageSize));
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, genderFilter, page, pageSize]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Flash banner helper
  function showBanner(type: 'success' | 'error', message: string) {
    setBanner({ type, message });
    setTimeout(() => setBanner(null), 4000);
  }

  // Handle Create or Update
  async function handleSaveStudent(payload: StudentCreate | StudentUpdate) {
    try {
      if (editingStudent) {
        if (!isUsingFallback) {
          const updated = await studentsApi.update(editingStudent.id, payload as StudentUpdate);
          setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        } else {
          setStudents((prev) => prev.map((s) => {
            if (s.id !== editingStudent.id) return s;

            const firstName = payload.first_name ?? s.first_name;
            const lastName = payload.last_name ?? s.last_name;
            const dateOfBirth = payload.date_of_birth === undefined ? s.date_of_birth : payload.date_of_birth;

            return {
              ...s,
              first_name: firstName,
              last_name: lastName,
              full_name: `${firstName} ${lastName}`.trim(),
              date_of_birth: dateOfBirth,
              age: dateOfBirth ? new Date().getFullYear() - new Date(dateOfBirth).getFullYear() : null,
              gender: payload.gender === undefined ? s.gender : payload.gender,
              email: payload.email ?? s.email,
              phone: payload.phone === undefined ? s.phone : payload.phone,
              address: payload.address === undefined ? s.address : payload.address,
              guardian_name: payload.guardian_name === undefined ? s.guardian_name : payload.guardian_name,
              guardian_phone: payload.guardian_phone === undefined ? s.guardian_phone : payload.guardian_phone,
              status: payload.status ?? s.status,
              enrolled_at: payload.enrolled_at === undefined ? s.enrolled_at : payload.enrolled_at,
              note: payload.note === undefined ? s.note : payload.note,
              updated_at: new Date().toISOString(),
            };
          }));
        }
        showBanner('success', 'Student record updated successfully.');
      } else {
        if (!isUsingFallback) {
          const created = await studentsApi.create(payload as StudentCreate);
          setStudents((prev) => [created, ...prev]);
          setTotal((prev) => prev + 1);
        } else {
          const newStudent: StudentOut = {
            id: `temp-${Date.now()}`,
            student_code: `STU-2024-${String(Math.floor(Math.random() * 900) + 100)}`,
            auth_id: null,
            first_name: payload.first_name || '',
            last_name: payload.last_name || '',
            full_name: `${payload.first_name} ${payload.last_name}`.trim(),
            date_of_birth: payload.date_of_birth || null,
            age: payload.date_of_birth
              ? new Date().getFullYear() - new Date(payload.date_of_birth).getFullYear()
              : null,
            gender: payload.gender || null,
            image_url: null,
            email: payload.email || '',
            phone: payload.phone || null,
            address: payload.address || null,
            guardian_name: payload.guardian_name || null,
            guardian_phone: payload.guardian_phone || null,
            status: payload.status || 'active',
            enrolled_at: payload.enrolled_at || null,
            note: payload.note || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: null,
            updated_by: null,
          };
          setStudents((prev) => [newStudent, ...prev]);
          setTotal((prev) => prev + 1);
        }
        showBanner('success', 'New student registered successfully.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed.';
      showBanner('error', msg);
      throw err;
    }
  }

  // Handle Delete
  async function handleDelete(id: string) {
    setDeleteLoading(true);
    try {
      if (!isUsingFallback) {
        await studentsApi.delete(id);
      }
      setStudents((prev) => prev.filter((s) => s.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      setDeletingId(null);
      showBanner('success', 'Student removed successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not delete student.';
      showBanner('error', msg);
    } finally {
      setDeleteLoading(false);
    }
  }

  // Handle Status Toggle
  async function handleStatusChange(student: StudentOut, newStatus: StudentStatus) {
    try {
      if (!isUsingFallback) {
        await studentsApi.updateStatus(student.id, newStatus);
      }
      setStudents((prev) =>
        prev.map((s) => (s.id === student.id ? { ...s, status: newStatus } : s))
      );
      showBanner('success', `Status updated to ${newStatus}.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update status.';
      showBanner('error', msg);
    }
  }

  // Stats Counters
  const stats = useMemo(() => {
    const list = isUsingFallback ? mockStudents : students;
    return {
      total: isUsingFallback ? mockStudents.length : total,
      active: list.filter((s) => s.status === 'active').length,
      prospect: list.filter((s) => s.status === 'prospect').length,
      graduated: list.filter((s) => s.status === 'graduated').length,
    };
  }, [students, total, isUsingFallback]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="space-y-6 pb-12">
      {/* Banner Notifications */}
      {banner && (
        <div
          role="alert"
          className={`flex items-center justify-between rounded-xl border p-4 text-sm font-medium shadow-sm animate-slide-in-right ${
            banner.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              : 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400'
          }`}
        >
          <span>{banner.message}</span>
          <button
            onClick={() => setBanner(null)}
            className="text-xs opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Students Management
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Monitor enrolled students, manage profiles, credentials, and academic status.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingStudent(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110 active:brightness-95 shrink-0"
          style={{ background: 'var(--brand-primary)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Register Student
        </button>
      </div>

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div
          className="rounded-2xl border p-4 shadow-sm transition hover:shadow-md"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Total Students
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              </svg>
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {stats.total}
          </p>
        </div>

        <div
          className="rounded-2xl border p-4 shadow-sm transition hover:shadow-md"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Active
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {stats.active}
          </p>
        </div>

        <div
          className="rounded-2xl border p-4 shadow-sm transition hover:shadow-md"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Prospects
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
            {stats.prospect}
          </p>
        </div>

        <div
          className="rounded-2xl border p-4 shadow-sm transition hover:shadow-md"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Graduated
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
            {stats.graduated}
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div
        className="flex flex-col gap-3 rounded-2xl border p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
      >
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Box */}
          <div
            className="flex flex-1 items-center gap-2.5 rounded-xl border px-3 py-2 transition focus-within:border-[var(--brand-primary)] focus-within:ring-2 focus-within:ring-[var(--brand-primary)]/15"
            style={{
              background: 'var(--bg-muted)',
              borderColor: 'var(--border-default)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-tertiary)' }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, student code, email, or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-transparent text-xs outline-none"
              style={{ color: 'var(--text-primary)' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as StudentStatus | 'all');
              setPage(1);
            }}
            className="rounded-xl border px-3 py-2 text-xs font-medium outline-none transition focus:border-[var(--brand-primary)]"
            style={{
              background: 'var(--bg-muted)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="prospect">Prospect</option>
            <option value="suspended">Suspended</option>
            <option value="graduated">Graduated</option>
            <option value="withdrawn">Withdrawn</option>
          </select>

          {/* Gender Filter Dropdown */}
          <select
            value={genderFilter}
            onChange={(e) => {
              setGenderFilter(e.target.value as Gender | 'all');
              setPage(1);
            }}
            className="rounded-xl border px-3 py-2 text-xs font-medium outline-none transition focus:border-[var(--brand-primary)]"
            style={{
              background: 'var(--bg-muted)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Refresh & Reset Actions */}
        <div className="flex items-center gap-2">
          {(search || statusFilter !== 'all' || genderFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setGenderFilter('all');
                setPage(1);
              }}
              className="rounded-xl border px-3 py-2 text-xs font-medium transition hover:bg-[var(--bg-surface-hover)]"
              style={{
                borderColor: 'var(--border-default)',
                color: 'var(--text-secondary)',
              }}
            >
              Reset Filters
            </button>
          )}

          <button
            onClick={() => fetchStudents()}
            className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition hover:bg-[var(--bg-surface-hover)]"
            style={{
              borderColor: 'var(--border-default)',
              color: 'var(--text-secondary)',
            }}
            title="Refresh List"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={loading ? 'animate-spin' : ''}>
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l6 6" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div
        className="overflow-hidden rounded-2xl border shadow-sm"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr
                className="border-b"
                style={{ borderColor: 'var(--border-default)', background: 'var(--bg-muted)' }}
              >
                <th className="py-3.5 px-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Student
                </th>
                <th className="py-3.5 px-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Contact
                </th>
                <th className="py-3.5 px-4 font-semibold hidden md:table-cell" style={{ color: 'var(--text-secondary)' }}>
                  Guardian
                </th>
                <th className="py-3.5 px-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Status
                </th>
                <th className="py-3.5 px-4 font-semibold hidden lg:table-cell" style={{ color: 'var(--text-secondary)' }}>
                  Enrolled
                </th>
                <th className="py-3.5 px-4 font-semibold hidden lg:table-cell" style={{ color: 'var(--text-secondary)' }}>
                  Creator
                </th>
                <th className="py-3.5 px-4 text-right font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="student-table-rows">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Spinner size={24} />
                      <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Loading students data...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--bg-muted)] text-[var(--text-tertiary)]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                      </div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                        No students found
                      </p>
                      <p className="text-xs max-w-sm" style={{ color: 'var(--text-secondary)' }}>
                        {search || statusFilter !== 'all'
                          ? 'Try adjusting your search criteria or clearing filters.'
                          : 'Get started by registering the first student to your academy.'}
                      </p>
                      <button
                        onClick={() => {
                          setEditingStudent(null);
                          setIsModalOpen(true);
                        }}
                        className="mt-3 rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-sm"
                        style={{ background: 'var(--brand-primary)' }}
                      >
                        + Add Student
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                students.map((student) => {
                  const initials = student.full_name
                    ? student.full_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : 'ST';

                  return (
                    <tr
                      key={student.id}
                      className="transition-colors hover:bg-[var(--bg-surface-hover)]"
                    >
                      {/* Student info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xs font-bold"
                            style={{
                              background:
                                'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-light, #3b82f6))',
                              color: 'white',
                            }}
                          >
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <button
                              onClick={() => {
                                setViewingStudent(student);
                                setIsDetailOpen(true);
                              }}
                              className="font-semibold text-sm text-left truncate block hover:underline"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {student.full_name}
                            </button>
                            <div className="flex items-center gap-2 text-[11px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                              <span>{student.student_code}</span>
                              {student.gender && (
                                <span className="capitalize font-sans">• {student.gender}</span>
                              )}
                              {student.age !== null && student.age !== undefined && (
                                <span className="font-sans">• {student.age}y</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-4">
                        <div className="text-xs space-y-0.5">
                          <div className="truncate max-w-[200px]" style={{ color: 'var(--text-primary)' }}>
                            {student.email}
                          </div>
                          <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                            {toLocalDisplay(student.phone || '—')}
                          </div>
                        </div>
                      </td>

                      {/* Guardian */}
                      <td className="py-3 px-4 hidden md:table-cell">
                        <div className="text-xs space-y-0.5">
                          <div style={{ color: 'var(--text-primary)' }}>
                            {student.guardian_name || '—'}
                          </div>
                          <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                            {toLocalDisplay(student.guardian_phone || '—')}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <StudentStatusBadge status={student.status} />
                          {/* Quick status dropdown */}
                          <select
                            value={student.status}
                            onChange={(e) =>
                              handleStatusChange(student, e.target.value as StudentStatus)
                            }
                            className="text-[11px] rounded border bg-transparent px-1.5 py-0.5 outline-none cursor-pointer hover:border-[var(--brand-primary)] opacity-60 hover:opacity-100 transition"
                            style={{
                              borderColor: 'var(--border-default)',
                              color: 'var(--text-secondary)',
                            }}
                            title="Change status"
                          >
                            <option value="active">Active</option>
                            <option value="prospect">Prospect</option>
                            <option value="suspended">Suspended</option>
                            <option value="graduated">Graduated</option>
                            <option value="withdrawn">Withdrawn</option>
                          </select>
                        </div>
                      </td>

                      {/* Enrolled date */}
                      <td className="py-3 px-4 hidden lg:table-cell" style={{ color: 'var(--text-secondary)' }}>
                        {student.enrolled_at ? new Date(student.enrolled_at).toLocaleDateString() : '—'}
                      </td>
                            <td className="py-3 px-4 hidden md:table-cell">
                        <div className="text-xs space-y-0.5">
                          <div style={{ color: 'var(--text-primary)' }}>
                            Created: {student.created_by?.name|| '—'}
                          </div>
                          <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                            Updated: {student.updated_by?.name|| '—'}
                          </div>
                        </div>
                      </td>
                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View details */}
                          <button
                            onClick={() => {
                              setViewingStudent(student);
                              setIsDetailOpen(true);
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-lg transition hover:bg-[var(--bg-surface-hover)]"
                            style={{ color: 'var(--text-secondary)' }}
                            title="View Profile"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => {
                              setEditingStudent(student);
                              setIsModalOpen(true);
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-lg transition hover:bg-[var(--bg-surface-hover)]"
                            style={{ color: 'var(--text-secondary)' }}
                            title="Edit Student"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeletingId(student.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg transition hover:bg-rose-500/10 hover:text-rose-600"
                            style={{ color: 'var(--text-tertiary)' }}
                            title="Delete Student"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t px-4 py-3 text-xs"
          style={{ borderColor: 'var(--border-default)', background: 'var(--bg-muted)' }}
        >
          <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            <span>
              Showing {students.length > 0 ? (page - 1) * pageSize + 1 : 0} to{' '}
              {Math.min(page * pageSize, total)} of {total} students
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-lg border bg-transparent px-2 py-1 outline-none"
              style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
            >
              <option value="10">10 / page</option>
              <option value="20">20 / page</option>
              <option value="50">50 / page</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border px-3 py-1.5 font-medium transition hover:bg-[var(--bg-surface-hover)] disabled:opacity-40"
              style={{
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            >
              Previous
            </button>
            <span className="px-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border px-3 py-1.5 font-medium transition hover:bg-[var(--bg-surface-hover)] disabled:opacity-40"
              style={{
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setDeletingId(null)}
          />
          <div
            className="relative z-10 w-full max-w-sm rounded-2xl border p-6 shadow-2xl animate-fade-in-scale space-y-4"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
          >
            <div className="grid h-10 w-10 place-items-center rounded-full bg-rose-500/10 text-rose-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                Remove Student Record?
              </h3>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Are you sure you want to remove this student? This action can be reversed via the restore endpoint if needed.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="rounded-lg border px-4 py-2 text-xs font-medium hover:bg-[var(--bg-surface-hover)]"
                style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => deletingId && handleDelete(deletingId)}
                className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700"
              >
                {deleteLoading && <Spinner size={12} />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStudent}
        student={editingStudent}
      />

      {/* Detail Slideover / Modal */}
      <StudentDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        student={viewingStudent}
        onEdit={(st) => {
          setEditingStudent(st);
          setIsModalOpen(true);
        }}
      />
    </div>
  );
}
