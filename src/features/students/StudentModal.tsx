'use client';

import React, { useState, useEffect } from 'react';
import type {
  Gender,
  StudentCreate,
  StudentOut,
  StudentStatus,
  StudentUpdate,
} from '@/src/services/students/students.types';
import { isValidPhone, toE164, toLocalDisplay } from '@/src/shared/utils/phone';
import { Spinner } from '@/src/components/ui/Spinner';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: StudentCreate | StudentUpdate) => Promise<void>;
  student?: StudentOut | null;
}

export function StudentModal({ isOpen, onClose, onSave, student }: StudentModalProps) {
  const isEdit = Boolean(student);

  const [activeTab, setActiveTab] = useState<'basic' | 'guardian' | 'enrollment'>('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');

  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');

  const [status, setStatus] = useState<StudentStatus>('active');
  const [enrolledAt, setEnrolledAt] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (student) {
      setFirstName(student.first_name || '');
      setLastName(student.last_name || '');
      setEmail(student.email || '');
      setPhone(toLocalDisplay(student.phone));
      setGender(student.gender || '');
      setDob(student.date_of_birth ? student.date_of_birth.substring(0, 10) : '');
      setAddress(student.address || '');
      setGuardianName(student.guardian_name || '');
      setGuardianPhone(toLocalDisplay(student.guardian_phone));
      setStatus(student.status || 'active');
      setEnrolledAt(student.enrolled_at ? student.enrolled_at.substring(0, 10) : '');
      setNote(student.note || '');
    } else {
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setGender('');
      setDob('');
      setAddress('');
      setGuardianName('');
      setGuardianPhone('');
      setStatus('active');
      setEnrolledAt(new Date().toISOString().substring(0, 10));
      setNote('');
    }
    setError(null);
    setActiveTab('basic');
  }, [student, isOpen]);

  if (!isOpen) return null;

  function validate(): string | null {
    if (!firstName.trim()) return 'First name is required.';
    if (!lastName.trim()) return 'Last name is required.';
    if (!email.trim()) return 'Email is required.';
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Please provide a valid email address.';

    const todayStr = new Date().toISOString().substring(0, 10);
    if (dob && dob > todayStr) {
      return 'Date of birth cannot be in the future.';
    }

    if (phone.trim()) {
      if (!isValidPhone(phone)) {
        return 'Enter a valid phone number, e.g. 097 424 2347 or +855 97 424 2347.';
      }
    }

    if (guardianPhone.trim()) {
      if (!isValidPhone(guardianPhone)) {
        return 'Enter a valid guardian phone number, e.g. 097 424 2347 or +855 97 424 2347.';
      }
    }

    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const valError = validate();
    if (valError) {
      setError(valError);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const cleanPhone = toE164(phone);
      const cleanGPhone = toE164(guardianPhone);

      const payload: StudentCreate = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: cleanPhone,
        gender: gender ? (gender as Gender) : null,
        date_of_birth: dob || null,
        address: address.trim() || null,
        guardian_name: guardianName.trim() || null,
        guardian_phone: cleanGPhone,
        status,
        enrolled_at: enrolledAt || null,
        note: note.trim() || null,
      };

      await onSave(payload);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save student. Please verify all fields.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const inputStyles =
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
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl animate-fade-in-scale"
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
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {isEdit ? 'Edit Student Profile' : 'Register New Student'}
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {isEdit ? `Updating ${student?.student_code}` : 'Enter student academic & contact credentials'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-surface-hover)]"
            style={{ color: 'var(--text-tertiary)' }}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          className="flex border-b px-6"
          style={{ borderColor: 'var(--border-default)', background: 'var(--bg-muted)' }}
        >
          {[
            { id: 'basic', label: '1. Basic Info' },
            { id: 'guardian', label: '2. Guardian & Address' },
            { id: 'enrollment', label: '3. Status & Notes' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                  : 'border-transparent hover:text-[var(--text-primary)]'
              }`}
              style={{
                color: activeTab === tab.id ? 'var(--brand-primary)' : 'var(--text-secondary)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div
              className="rounded-lg border px-4 py-2.5 text-xs font-medium animate-fade-in"
              style={{
                borderColor: 'var(--status-error)',
                background: 'var(--status-error-bg)',
                color: 'var(--status-error)',
              }}
            >
              {error}
            </div>
          )}

          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    placeholder="e.g. Sokha"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={inputStyles}
                    style={{
                      borderColor: 'var(--border-default)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    placeholder="e.g. Chan"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={inputStyles}
                    style={{
                      borderColor: 'var(--border-default)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sokha.chan@student.edu.kh"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputStyles}
                    style={{
                      borderColor: 'var(--border-default)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="097 424 2347"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputStyles}
                    style={{
                      borderColor: 'var(--border-default)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <span className="text-[10px] text-slate-400">Accepts local or +855 format; saves as +855974242347.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender | '')}
                    className={inputStyles}
                    style={{
                      borderColor: 'var(--border-default)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    max={new Date().toISOString().substring(0, 10)}
                    onChange={(e) => setDob(e.target.value)}
                    className={inputStyles}
                    style={{
                      borderColor: 'var(--border-default)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GUARDIAN & ADDRESS */}
          {activeTab === 'guardian' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Guardian / Parent Name
                  </label>
                  <input
                    type="text"
                    maxLength={150}
                    placeholder="e.g. Rith Chan"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    className={inputStyles}
                    style={{
                      borderColor: 'var(--border-default)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Guardian Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="097 424 2347"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    className={inputStyles}
                    style={{
                      borderColor: 'var(--border-default)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Residential Address
                </label>
                <textarea
                  rows={3}
                  maxLength={1000}
                  placeholder="Street address, Khan, Sangkat, Province/City"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={inputStyles}
                  style={{
                    borderColor: 'var(--border-default)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>
          )}

          {/* TAB 3: ENROLLMENT & NOTES */}
          {activeTab === 'enrollment' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Student Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as StudentStatus)}
                    className={inputStyles}
                    style={{
                      borderColor: 'var(--border-default)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="prospect">Prospect</option>
                    <option value="suspended">Suspended</option>
                    <option value="graduated">Graduated</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Enrollment Date
                  </label>
                  <input
                    type="date"
                    value={enrolledAt}
                    onChange={(e) => setEnrolledAt(e.target.value)}
                    className={inputStyles}
                    style={{
                      borderColor: 'var(--border-default)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Administrative Note
                </label>
                <textarea
                  rows={3}
                  maxLength={5000}
                  placeholder="Background notes, program track, scholarship details..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className={inputStyles}
                  style={{
                    borderColor: 'var(--border-default)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div
            className="flex items-center justify-between border-t pt-4"
            style={{ borderColor: 'var(--border-default)' }}
          >
            <div className="flex gap-2">
              {activeTab !== 'basic' && (
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(activeTab === 'enrollment' ? 'guardian' : 'basic')
                  }
                  className="rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:bg-[var(--bg-surface-hover)]"
                  style={{
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Previous
                </button>
              )}
              {activeTab !== 'enrollment' && (
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(activeTab === 'basic' ? 'guardian' : 'enrollment')
                  }
                  className="rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:bg-[var(--bg-surface-hover)]"
                  style={{
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                >
                  Next
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border px-4 py-2 text-xs font-medium transition hover:bg-[var(--bg-surface-hover)]"
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
                {isEdit ? 'Save Changes' : 'Create Student'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
