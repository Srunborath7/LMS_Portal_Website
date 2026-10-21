import type { Gender, UserRef } from '../students/students.types'; // better: move both to types/common.ts

export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'volunteer';
export type TeacherStatus = 'active' | 'on_leave' | 'resigned' | 'terminated';

export interface TeacherBase {
  first_name: string;
  last_name: string;
  date_of_birth?: string | null;         // "YYYY-MM-DD"
  gender?: Gender | null;
  nationality?: string | null;

  email: string;
  phone?: string | null;                 // send E.164 via toE164()
  address?: string | null;

  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;

  title?: string | null;                 // Mr., Ms., Dr., Prof.
  highest_degree?: string | null;
  specialization?: string | null;
  years_of_experience?: number | null;   // 0-60
  bio?: string | null;

  employment_type?: EmploymentType;      // default: full_time
  hire_date?: string | null;
  end_date?: string | null;
  hourly_rate?: number | string | null;  // Decimal; the API may return it as a string
  note?: string | null;
}

export interface TeacherCreate extends TeacherBase {
  status?: TeacherStatus;                // default: active
  auth_id?: string | null;
}

// PATCH: omit a field to leave it unchanged. null only on nullable fields.
export interface TeacherUpdate {
  first_name?: string;                   // NOT NULL in DB
  last_name?: string;                    // NOT NULL in DB
  email?: string;                        // NOT NULL in DB
  employment_type?: EmploymentType;      // NOT NULL in DB
  status?: TeacherStatus;                // NOT NULL in DB

  date_of_birth?: string | null;
  gender?: Gender | null;
  nationality?: string | null;
  phone?: string | null;
  address?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  title?: string | null;
  highest_degree?: string | null;
  specialization?: string | null;
  years_of_experience?: number | null;
  bio?: string | null;
  hire_date?: string | null;
  end_date?: string | null;
  hourly_rate?: number | string | null;
  note?: string | null;
}

/** Full view for staff/admin. */
export interface TeacherOut {
  id: string;
  teacher_code: string;
  auth_id: string | null;

  first_name: string;
  last_name: string;
  full_name: string;
  date_of_birth: string | null;
  gender: Gender | null;
  nationality: string | null;
  image_url: string | null;

  email: string;
  phone: string | null;                  // E.164, show with toLocalDisplay()
  address: string | null;

  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;

  title: string | null;
  highest_degree: string | null;
  specialization: string | null;
  years_of_experience: number | null;
  bio: string | null;

  employment_type: EmploymentType;
  status: TeacherStatus;
  hire_date: string | null;
  end_date: string | null;
  hourly_rate: string | null;            // Pydantic serializes Decimal as a string
  note: string | null;

  created_at: string;
  updated_at: string;
  created_by: UserRef | null;
  updated_by: UserRef | null;
}

/** Safe view for students, parents and public pages. */
export interface TeacherPublic {
  id: string;
  teacher_code: string;
  full_name: string;
  title: string | null;
  image_url: string | null;
  highest_degree: string | null;
  specialization: string | null;
  years_of_experience: number | null;
  bio: string | null;
  email: string;
}

export interface TeacherBrief {
  id: string;
  teacher_code: string;
  full_name: string;
  image_url?: string | null;
  status: TeacherStatus;
}

export interface TeacherFilter {
  q?: string;
  status?: TeacherStatus;
  employment_type?: EmploymentType;
  specialization?: string;
  page?: number;
  size?: number;
}

export interface TeacherPage {
  items: TeacherOut[];
  total: number;
  page: number;
  size: number;
}