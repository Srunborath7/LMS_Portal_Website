"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { teachersApi } from "@/src/services/teachers";
import type {
  EmploymentType,
  TeacherCreate,
  TeacherOut,
  TeacherStatus,
  TeacherUpdate,
} from "@/src/services/teachers/teachers.type";
import { mockTeachers } from "@/src/features/teachers/mockData";
import { TeacherModal } from "@/src/features/teachers/TeacherModal";
import { TeacherDetailModal } from "@/src/features/teachers/TeacherDetailModal";
import { TeacherStatusBadge } from "@/src/features/teachers/TeacherStatusBadge";
import { toLocalDisplay } from "@/src/shared/utils/phone";
import { Spinner } from "@/src/components/ui/Spinner";

type TeacherPayload = TeacherCreate | TeacherUpdate;

function mergeTeacher(
  current: TeacherOut,
  payload: TeacherPayload,
): TeacherOut {
  const firstName = payload.first_name ?? current.first_name;
  const lastName = payload.last_name ?? current.last_name;
  return {
    ...current,
    first_name: firstName,
    last_name: lastName,
    full_name: `${firstName} ${lastName}`.trim(),
    email: payload.email ?? current.email,
    phone: payload.phone === undefined ? current.phone : payload.phone,
    date_of_birth:
      payload.date_of_birth === undefined
        ? current.date_of_birth
        : payload.date_of_birth,
    gender: payload.gender === undefined ? current.gender : payload.gender,
    nationality:
      payload.nationality === undefined
        ? current.nationality
        : payload.nationality,
    address: payload.address === undefined ? current.address : payload.address,
    emergency_contact_name:
      payload.emergency_contact_name === undefined
        ? current.emergency_contact_name
        : payload.emergency_contact_name,
    emergency_contact_phone:
      payload.emergency_contact_phone === undefined
        ? current.emergency_contact_phone
        : payload.emergency_contact_phone,
    title: payload.title === undefined ? current.title : payload.title,
    highest_degree:
      payload.highest_degree === undefined
        ? current.highest_degree
        : payload.highest_degree,
    specialization:
      payload.specialization === undefined
        ? current.specialization
        : payload.specialization,
    years_of_experience:
      payload.years_of_experience === undefined
        ? current.years_of_experience
        : payload.years_of_experience,
    bio: payload.bio === undefined ? current.bio : payload.bio,
    employment_type: payload.employment_type ?? current.employment_type,
    status: payload.status ?? current.status,
    hire_date:
      payload.hire_date === undefined ? current.hire_date : payload.hire_date,
    end_date:
      payload.end_date === undefined ? current.end_date : payload.end_date,
    hourly_rate:
      payload.hourly_rate === undefined
        ? current.hourly_rate
        : payload.hourly_rate == null
          ? null
          : String(payload.hourly_rate),
    note: payload.note === undefined ? current.note : payload.note,
    auth_id: payload.auth_id !== undefined ? payload.auth_id : current.auth_id,
    updated_at: new Date().toISOString(),
  };
}


function createMockTeacher(payload: TeacherCreate): TeacherOut {
  const now = new Date().toISOString();
  return {
    id: `local-${Date.now()}`,
    teacher_code: `TCH-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
    auth_id: payload.auth_id ?? null,
    first_name: payload.first_name,
    last_name: payload.last_name,
    full_name: `${payload.first_name} ${payload.last_name}`.trim(),
    date_of_birth: payload.date_of_birth ?? null,
    gender: payload.gender ?? null,
    nationality: payload.nationality ?? null,
    image_url: null,
    email: payload.email,
    phone: payload.phone ?? null,
    address: payload.address ?? null,
    emergency_contact_name: payload.emergency_contact_name ?? null,
    emergency_contact_phone: payload.emergency_contact_phone ?? null,
    title: payload.title ?? null,
    highest_degree: payload.highest_degree ?? null,
    specialization: payload.specialization ?? null,
    years_of_experience: payload.years_of_experience ?? null,
    bio: payload.bio ?? null,
    employment_type: payload.employment_type ?? "full_time",
    status: payload.status ?? "active",
    hire_date: payload.hire_date ?? null,
    end_date: payload.end_date ?? null,
    hourly_rate:
      payload.hourly_rate == null ? null : String(payload.hourly_rate),
    note: payload.note ?? null,
    created_at: now,
    updated_at: now,
    created_by: null,
    updated_by: null,
  };
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<TeacherOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TeacherStatus | "all">("all");
  const [employment, setEmployment] = useState<EmploymentType | "all">("all");
  const [editing, setEditing] = useState<TeacherOut | null>(null);
  const [viewing, setViewing] = useState<TeacherOut | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<TeacherOut | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await teachersApi.list({
        q: search.trim() || undefined,
        status: status === "all" ? undefined : status,
        employment_type: employment === "all" ? undefined : employment,
        size: 100,
      });
      setTeachers(result.items);
      setUsingFallback(false);
    } catch {
      const query = search.trim().toLowerCase();
      setTeachers(
        mockTeachers.filter(
          (teacher) =>
            (!query ||
              `${teacher.full_name} ${teacher.email} ${teacher.teacher_code} ${teacher.specialization ?? ""}`
                .toLowerCase()
                .includes(query)) &&
            (status === "all" || teacher.status === status) &&
            (employment === "all" || teacher.employment_type === employment),
        ),
      );
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, [search, status, employment]);

  useEffect(() => {
    void loadTeachers();
  }, [loadTeachers]);

  const stats = useMemo(
    () => ({
      total: teachers.length,
      active: teachers.filter((teacher) => teacher.status === "active").length,
      onLeave: teachers.filter((teacher) => teacher.status === "on_leave")
        .length,
      fullTime: teachers.filter(
        (teacher) => teacher.employment_type === "full_time",
      ).length,
    }),
    [teachers],
  );

  async function saveTeacher(payload: TeacherPayload) {
    try {
      if (editing) {
        if (usingFallback) {
          setTeachers((items) =>
            items.map((item) =>
              item.id === editing.id ? mergeTeacher(item, payload) : item,
            ),
          );
        } else {
          const updated = await teachersApi.update(
            editing.id,
            payload as TeacherUpdate,
          );
          setTeachers((items) =>
            items.map((item) => (item.id === updated.id ? updated : item)),
          );
        }
        setMessage("Teacher profile updated.");
      } else {
        if (usingFallback) {
          setTeachers((items) => [
            createMockTeacher(payload as TeacherCreate),
            ...items,
          ]);
        } else {
          const created = await teachersApi.create(payload as TeacherCreate);
          setTeachers((items) => [created, ...items]);
        }
        setMessage("Teacher registered.");
      }
      setFormOpen(false);
      setEditing(null);
    } catch (cause) {
      setMessage(
        cause instanceof Error ? cause.message : "Could not save the teacher.",
      );
      throw cause;
    }
  }

  async function changeStatus(teacher: TeacherOut, nextStatus: TeacherStatus) {
    try {
      if (!usingFallback)
        await teachersApi.updateStatus(teacher.id, nextStatus);
      setTeachers((items) =>
        items.map((item) =>
          item.id === teacher.id
            ? {
                ...item,
                status: nextStatus,
                updated_at: new Date().toISOString(),
              }
            : item,
        ),
      );
    } catch (cause) {
      setMessage(
        cause instanceof Error
          ? cause.message
          : "Could not update teacher status.",
      );
    }
  }

  async function deleteTeacher() {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      if (!usingFallback) await teachersApi.delete(deleting.id);
      setTeachers((items) => items.filter((item) => item.id !== deleting.id));
      setMessage("Teacher removed successfully.");
      setDeleting(null);
    } catch (cause) {
      setMessage(
        cause instanceof Error ? cause.message : "Could not remove teacher.",
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Teacher Management
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage teacher profiles, employment, and status.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
          style={{ background: "var(--brand-primary)" }}
        >
          ＋ Register teacher
        </button>
      </div>

      {message && (
        <div
          role="status"
          className="flex justify-between rounded-lg border p-3 text-sm"
          style={{
            borderColor: "var(--border-default)",
            color: "var(--text-secondary)",
            background: "var(--bg-surface)",
          }}
        >
          {message}
          <button
            type="button"
            onClick={() => setMessage("")}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}
      {usingFallback && (
        <p
          className="rounded-lg px-3 py-2 text-xs"
          style={{
            background: "var(--status-warning-bg)",
            color: "var(--status-warning)",
          }}
        >
          Showing sample teacher data because the API is unavailable.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Total teachers", stats.total],
          ["Active", stats.active],
          ["On leave", stats.onLeave],
          ["Full time", stats.fullTime],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border p-4"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-default)",
            }}
          >
            <p
              className="text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {label}
            </p>
            <p
              className="mt-2 text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      <section
        className="overflow-hidden rounded-xl border"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border-default)",
        }}
      >
        <div
          className="flex flex-col gap-3 border-b p-4 sm:flex-row"
          style={{ borderColor: "var(--border-default)" }}
        >
          <input
            aria-label="Search teachers"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email, code, or specialization"
            className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--border-default)",
              background: "var(--bg-input)",
              color: "var(--text-primary)",
            }}
          />
          <select
            aria-label="Filter by status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as TeacherStatus | "all")
            }
            className="rounded-lg border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--border-default)",
              background: "var(--bg-input)",
              color: "var(--text-primary)",
            }}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="on_leave">On leave</option>
            <option value="resigned">Resigned</option>
            <option value="terminated">Terminated</option>
          </select>
          <select
            aria-label="Filter by employment type"
            value={employment}
            onChange={(event) =>
              setEmployment(event.target.value as EmploymentType | "all")
            }
            className="rounded-lg border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--border-default)",
              background: "var(--bg-input)",
              color: "var(--text-primary)",
            }}
          >
            <option value="all">All employment</option>
            <option value="full_time">Full time</option>
            <option value="part_time">Part time</option>
            <option value="contract">Contract</option>
            <option value="volunteer">Volunteer</option>
          </select>
          <button
            type="button"
            onClick={() => void loadTeachers()}
            className="rounded-lg border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--border-default)",
              color: "var(--text-secondary)",
            }}
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead
              style={{
                background: "var(--bg-muted)",
                color: "var(--text-secondary)",
              }}
            >
              <tr>
                <th className="px-4 py-3 font-semibold">Teacher</th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                <th className="px-4 py-3 font-semibold">Employment</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="student-table-rows">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center">
                    <Spinner size={22} />
                  </td>
                </tr>
              ) : teachers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-10 text-center"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    No teachers found.
                  </td>
                </tr>
              ) : (
                teachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="hover:bg-[var(--bg-surface-hover)]"
                  >
                    <td className="px-4 py-3">
                      <div
                        className="font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {teacher.title ? `${teacher.title} ` : ""}
                        {teacher.full_name}
                      </div>
                      <div
                        className="mt-1 text-xs"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {teacher.teacher_code} ·{" "}
                        {teacher.specialization || "No specialization"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div style={{ color: "var(--text-primary)" }}>
                        {teacher.email}
                      </div>
                      <div
                        className="mt-1 text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {toLocalDisplay(teacher.phone)}
                      </div>
                    </td>
                    <td
                      className="px-4 py-3 capitalize"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {teacher.employment_type.replace("_", " ")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <TeacherStatusBadge status={teacher.status} />
                        <select
                          aria-label={`Change ${teacher.full_name} status`}
                          value={teacher.status}
                          onChange={(event) =>
                            void changeStatus(
                              teacher,
                              event.target.value as TeacherStatus,
                            )
                          }
                          className="rounded border bg-transparent px-1.5 py-1 text-xs"
                          style={{
                            borderColor: "var(--border-default)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          <option value="active">Active</option>
                          <option value="on_leave">On leave</option>
                          <option value="resigned">Resigned</option>
                          <option value="terminated">Terminated</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setViewing(teacher)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg transition hover:bg-[var(--bg-surface-hover)]"
                          style={{ color: "var(--text-secondary)" }}
                          aria-label={`View ${teacher.full_name}`}
                          title="View profile"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(teacher);
                            setFormOpen(true);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg transition hover:bg-[var(--bg-surface-hover)]"
                          style={{ color: "var(--text-secondary)" }}
                          aria-label={`Edit ${teacher.full_name}`}
                          title="Edit teacher"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleting(teacher)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg transition hover:bg-rose-500/10 hover:text-rose-600"
                          style={{ color: "var(--text-tertiary)" }}
                          aria-label={`Delete ${teacher.full_name}`}
                          title="Delete teacher"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div
          className="border-t px-4 py-3 text-xs"
          style={{
            borderColor: "var(--border-default)",
            color: "var(--text-secondary)",
          }}
        >
          Showing {teachers.length} teacher{teachers.length === 1 ? "" : "s"}
        </div>
      </section>

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Cancel delete"
            onClick={() => setDeleting(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-teacher-title"
            className="relative z-10 w-full max-w-sm space-y-4 rounded-2xl border p-6 shadow-2xl"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-default)",
            }}
          >
            <div className="grid h-10 w-10 place-items-center rounded-full bg-rose-500/10 text-rose-600" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <div>
              <h2 id="delete-teacher-title" className="font-bold" style={{ color: "var(--text-primary)" }}>
                Remove teacher record?
              </h2>
              <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                Are you sure you want to remove {deleting.full_name}? This action can be reversed if the restore endpoint is available.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleting(null)}
                disabled={deleteLoading}
                className="rounded-lg border px-4 py-2 text-sm"
                style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void deleteTeacher()}
                disabled={deleteLoading}
                className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {deleteLoading && <Spinner size={14} />}
                Delete teacher
              </button>
            </div>
          </div>
        </div>
      )}

      <TeacherModal
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSave={saveTeacher}
        teacher={editing}
      />
      <TeacherDetailModal
        isOpen={Boolean(viewing)}
        onClose={() => setViewing(null)}
        teacher={viewing}
        onEdit={(teacher) => {
          setViewing(null);
          setEditing(teacher);
          setFormOpen(true);
        }}
      />
    </div>
  );
}
