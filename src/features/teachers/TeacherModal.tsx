"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import type { Gender } from "@/src/services/students/students.types";
import type {
  EmploymentType,
  TeacherCreate,
  TeacherOut,
  TeacherStatus,
  TeacherUpdate,
} from "@/src/services/teachers/teachers.type";
import { isValidPhone, toE164, toLocalDisplay } from "@/src/shared/utils/phone";
import { Spinner } from "@/src/components/ui/Spinner";

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TeacherCreate | TeacherUpdate) => Promise<void>;
  teacher?: TeacherOut | null;
}

interface TeacherFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: Gender | "";
  date_of_birth: string;
  nationality: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  title: string;
  highest_degree: string;
  specialization: string;
  years_of_experience: string;
  bio: string;
  employment_type: EmploymentType;
  status: TeacherStatus;
  hire_date: string;
  end_date: string;
  hourly_rate: string;
  note: string;
}

const today = () => new Date().toISOString().slice(0, 10);

function emptyValues(): TeacherFormValues {
  return {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    nationality: "",
    address: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    title: "",
    highest_degree: "",
    specialization: "",
    years_of_experience: "",
    bio: "",
    employment_type: "full_time",
    status: "active",
    hire_date: "",
    end_date: "",
    hourly_rate: "",
    note: "",
  };
}

const inputClass =
  "w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20";

function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label
      className="block min-w-0 text-xs font-semibold"
      style={{ color: "var(--text-secondary)" }}
    >
      <span className="mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

export function TeacherModal({
  isOpen,
  onClose,
  onSave,
  teacher,
}: TeacherModalProps) {
  const isEdit = Boolean(teacher);
  const [activeTab, setActiveTab] = useState<
    "personal" | "professional" | "employment"
  >("personal");
  const [values, setValues] = useState<TeacherFormValues>(emptyValues);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (teacher) {
      setValues({
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        email: teacher.email,
        phone: toLocalDisplay(teacher.phone),
        gender: teacher.gender ?? "",
        date_of_birth: teacher.date_of_birth?.slice(0, 10) ?? "",
        nationality: teacher.nationality ?? "",
        address: teacher.address ?? "",
        emergency_contact_name: teacher.emergency_contact_name ?? "",
        emergency_contact_phone: toLocalDisplay(
          teacher.emergency_contact_phone,
        ),
        title: teacher.title ?? "",
        highest_degree: teacher.highest_degree ?? "",
        specialization: teacher.specialization ?? "",
        years_of_experience:
          teacher.years_of_experience == null
            ? ""
            : String(teacher.years_of_experience),
        bio: teacher.bio ?? "",
        employment_type: teacher.employment_type,
        status: teacher.status,
        hire_date: teacher.hire_date?.slice(0, 10) ?? "",
        end_date: teacher.end_date?.slice(0, 10) ?? "",
        hourly_rate: teacher.hourly_rate ?? "",
        note: teacher.note ?? "",
      });
    } else {
      setValues({ ...emptyValues(), hire_date: isOpen ? today() : "" });
    }
    setError("");
    setActiveTab("personal");
  }, [teacher, isOpen]);

  if (!isOpen) return null;

  function update<K extends keyof TeacherFormValues>(
    key: K,
    value: TeacherFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function validate() {
    if (!values.first_name.trim() || !values.last_name.trim())
      return "Enter the teacher’s first and last name.";
    if (!/^\S+@\S+\.\S+$/.test(values.email.trim()))
      return "Enter a valid email address.";
    if (values.phone.trim() && !isValidPhone(values.phone))
      return "Enter a valid phone number, e.g. 097 424 2347.";
    if (
      values.emergency_contact_phone.trim() &&
      !isValidPhone(values.emergency_contact_phone)
    )
      return "Enter a valid emergency contact phone number.";
    const experience = Number(values.years_of_experience);
    if (
      values.years_of_experience &&
      (!Number.isInteger(experience) || experience < 0 || experience > 60)
    ) {
      return "Years of experience must be between 0 and 60.";
    }
    const rate = Number(values.hourly_rate);
    if (values.hourly_rate && (!Number.isFinite(rate) || rate < 0))
      return "Hourly rate must be a non-negative number.";
    if (
      values.hire_date &&
      values.end_date &&
      values.end_date < values.hire_date
    )
      return "End date must be on or after the hire date.";
    return "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (activeTab !== "employment") {
      setActiveTab(activeTab === "personal" ? "professional" : "employment");
      return;
    }
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const payload: TeacherCreate = {
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        email: values.email.trim().toLowerCase(),
        phone: toE164(values.phone),
        gender: values.gender || null,
        date_of_birth: values.date_of_birth || null,
        nationality: values.nationality.trim() || null,
        address: values.address.trim() || null,
        emergency_contact_name: values.emergency_contact_name.trim() || null,
        emergency_contact_phone: toE164(values.emergency_contact_phone),
        title: values.title.trim() || null,
        highest_degree: values.highest_degree.trim() || null,
        specialization: values.specialization.trim() || null,
        years_of_experience: values.years_of_experience
          ? Number(values.years_of_experience)
          : null,
        bio: values.bio.trim() || null,
        employment_type: values.employment_type,
        status: values.status,
        hire_date: values.hire_date || null,
        end_date: values.end_date || null,
        hourly_rate: values.hourly_rate || null,
        note: values.note.trim() || null,
      };
      await onSave(payload);
      onClose();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not save the teacher record.",
      );
    } finally {
      setLoading(false);
    }
  }

  const fieldStyle = {
    borderColor: "var(--border-default)",
    background: "var(--bg-input)",
    color: "var(--text-primary)",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      <button
        type="button"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close teacher form"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="teacher-form-title"
        className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border shadow-2xl"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border-default)",
        }}
      >
        <header
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div>
            <h2
              id="teacher-form-title"
              className="text-lg font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {isEdit ? "Edit teacher profile" : "Register teacher"}
            </h2>
            <p
              className="mt-1 text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              Enter contact, professional, and employment details.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-[var(--bg-surface-hover)]"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Close"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="m18 6-12 12M6 6l12 12" />
            </svg>
          </button>
        </header>

        <nav
          className="flex shrink-0 overflow-x-auto border-b px-3 sm:px-5"
          style={{
            borderColor: "var(--border-default)",
            background: "var(--bg-muted)",
          }}
          aria-label="Teacher form sections"
        >
          {[
            { id: "personal", label: "1. Personal Info" },
            { id: "professional", label: "2. Professional Info" },
            { id: "employment", label: "3. Employment Info" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`shrink-0 border-b-2 px-3 py-3 text-xs font-semibold transition-colors sm:px-4 ${activeTab === tab.id ? "border-[var(--brand-primary)]" : "border-transparent"}`}
              style={{
                color:
                  activeTab === tab.id
                    ? "var(--brand-primary)"
                    : "var(--text-secondary)",
              }}
              aria-current={activeTab === tab.id ? "step" : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 space-y-6 overflow-y-auto p-6"
        >
          {error && (
            <div
              role="alert"
              className="rounded-lg border p-3 text-sm"
              style={{
                borderColor: "var(--status-error)",
                background: "var(--status-error-bg)",
                color: "var(--status-error)",
              }}
            >
              {error}
            </div>
          )}

          {activeTab === "personal" && (
            <section className="space-y-4 animate-fade-in">
              <h3
                className="mb-3 text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}
              >
                Personal information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="First name *">
                  <input
                    required
                    value={values.first_name}
                    onChange={(e) => update("first_name", e.target.value)}
                    className={inputClass}
                    style={fieldStyle}
                  />
                </FormField>
                <FormField label="Last name *">
                  <input
                    required
                    value={values.last_name}
                    onChange={(e) => update("last_name", e.target.value)}
                    className={inputClass}
                    style={fieldStyle}
                  />
                </FormField>
                <FormField label="Email *">
                  <input
                    required
                    type="email"
                    value={values.email}
                    onChange={(e) => update("email", e.target.value)}
                    className={inputClass}
                    style={fieldStyle}
                  />
                </FormField>
                <FormField label="Phone">
                  <input
                    type="tel"
                    placeholder="097 424 2347"
                    value={values.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className={inputClass}
                    style={fieldStyle}
                  />
                </FormField>
                <FormField label="Title">
                  <input
                    placeholder="Mr., Ms., Dr."
                    value={values.title}
                    onChange={(e) => update("title", e.target.value)}
                    className={inputClass}
                    style={fieldStyle}
                  />
                </FormField>
                <FormField label="Gender">
                  <select
                    value={values.gender}
                    onChange={(e) =>
                      update("gender", e.target.value as Gender | "")
                    }
                    className={inputClass}
                    style={fieldStyle}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </FormField>
                <FormField label="Date of birth">
                  <input
                    type="date"
                    value={values.date_of_birth}
                    onChange={(e) => update("date_of_birth", e.target.value)}
                    className={inputClass}
                    style={fieldStyle}
                  />
                </FormField>
                <FormField label="Nationality">
                  <input
                    value={values.nationality}
                    onChange={(e) => update("nationality", e.target.value)}
                    className={inputClass}
                    style={fieldStyle}
                  />
                </FormField>
                <div className="sm:col-span-2">
                  <FormField label="Address">
                    <input
                      value={values.address}
                      onChange={(e) => update("address", e.target.value)}
                      className={inputClass}
                      style={fieldStyle}
                    />
                  </FormField>
                </div>
                <FormField label="Emergency contact name">
                  <input
                    value={values.emergency_contact_name}
                    onChange={(e) =>
                      update("emergency_contact_name", e.target.value)
                    }
                    className={inputClass}
                    style={fieldStyle}
                  />
                </FormField>
                <FormField label="Emergency contact phone">
                  <input
                    type="tel"
                    placeholder="097 424 2347"
                    value={values.emergency_contact_phone}
                    onChange={(e) =>
                      update("emergency_contact_phone", e.target.value)
                    }
                    className={inputClass}
                    style={fieldStyle}
                  />
                </FormField>
              </div>
            </section>
          )}

          {activeTab === "professional" && (
            <section className="space-y-4 animate-fade-in">
              <h3
                className="mb-3 text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}
              >
                Professional profile
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Highest degree">
                  <input
                    value={values.highest_degree}
                    onChange={(e) => update("highest_degree", e.target.value)}
                    className={inputClass}
                    style={fieldStyle}
                  />
                </FormField>
                <FormField label="Specialization">
                  <input
                    value={values.specialization}
                    onChange={(e) => update("specialization", e.target.value)}
                    className={inputClass}
                    style={fieldStyle}
                  />
                </FormField>
                <FormField label="Years of experience">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={values.years_of_experience}
                    onChange={(e) =>
                      update("years_of_experience", e.target.value)
                    }
                    className={inputClass}
                    style={fieldStyle}
                  />
                </FormField>
                <div className="sm:col-span-2">
                  <FormField label="Bio">
                    <textarea
                      rows={3}
                      value={values.bio}
                      onChange={(e) => update("bio", e.target.value)}
                      className={inputClass}
                      style={fieldStyle}
                    />
                  </FormField>
                </div>
              </div>
            </section>
          )}

          {activeTab === "employment" && (
            <section className="space-y-4 animate-fade-in">
              <h3
                className="mb-3 text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}
              >
                Employment information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormField label="Employment type">
                  <select
                    value={values.employment_type}
                    onChange={(e) =>
                      update(
                        "employment_type",
                        e.target.value as EmploymentType,
                      )
                    }
                    className={inputClass}
                    style={fieldStyle}
                  >
                    <option value="full_time">Full time</option>
                    <option value="part_time">Part time</option>
                    <option value="contract">Contract</option>
                    <option value="volunteer">Volunteer</option>
                  </select>
                </FormField>
                <FormField label="Status">
                  <select
                    value={values.status}
                    onChange={(e) =>
                      update("status", e.target.value as TeacherStatus)
                    }
                    className={inputClass}
                    style={fieldStyle}
                  >
                    <option value="active">Active</option>
                    <option value="on_leave">On leave</option>
                    <option value="resigned">Resigned</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </FormField>
                <FormField label="Hourly rate">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={values.hourly_rate}
                    onChange={(e) => update("hourly_rate", e.target.value)}
                    className={inputClass}
                    style={fieldStyle}
                  />
                </FormField>
                <FormField label="Hire date">
                  <input
                    type="date"
                    value={values.hire_date}
                    onChange={(e) => update("hire_date", e.target.value)}
                    className={inputClass}
                    style={fieldStyle}
                  />
                </FormField>
                <FormField label="End date">
                  <input
                    type="date"
                    value={values.end_date}
                    onChange={(e) => update("end_date", e.target.value)}
                    className={inputClass}
                    style={fieldStyle}
                  />
                </FormField>
                <div className="sm:col-span-2 lg:col-span-3">
                  <FormField label="Administrative note">
                    <textarea
                      rows={3}
                      value={values.note}
                      onChange={(e) => update("note", e.target.value)}
                      className={inputClass}
                      style={fieldStyle}
                    />
                  </FormField>
                </div>
              </div>
            </section>
          )}

          <footer
            className="flex justify-end gap-2 border-t pt-4"
            style={{ borderColor: "var(--border-default)" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm"
              style={{
                borderColor: "var(--border-default)",
                color: "var(--text-secondary)",
              }}
            >
              Cancel
            </button>
            {activeTab !== "personal" && (
              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    activeTab === "employment" ? "professional" : "personal",
                  )
                }
                className="rounded-lg border px-4 py-2 text-sm"
                style={{
                  borderColor: "var(--border-default)",
                  color: "var(--text-secondary)",
                }}
              >
                Previous
              </button>
            )}
            {activeTab !== "employment" ? (
              <button
                type="submit"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
                style={{ background: "var(--brand-primary)" }}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                style={{ background: "var(--brand-primary)" }}
              >
                {loading && <Spinner size={14} />}
                {isEdit ? "Save changes" : "Create teacher"}
              </button>
            )}
          </footer>
        </form>
      </section>
    </div>
  );
}
