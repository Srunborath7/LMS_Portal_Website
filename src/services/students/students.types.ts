export type Gender = 'male' | 'female' | 'other';
export type StudentStatus = 'prospect' | 'active' | 'suspended' | 'graduated' | 'withdrawn';

export interface UserRef {
  id: string;
  name: string;
}
export interface StudentBase {
  first_name: string;
  last_name: string;
  date_of_birth?: string | null;
  gender?: Gender | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  guardian_name?: string | null;
  guardian_phone?: string | null;
  enrolled_at?: string | null;
  note?: string | null;
}

export interface StudentCreate extends StudentBase {
  status?: StudentStatus;
  auth_id?: string | null;
}

export interface StudentUpdate {
  first_name?: string | null;
  last_name?: string | null;
  date_of_birth?: string | null;
  gender?: Gender | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  guardian_name?: string | null;
  guardian_phone?: string | null;
  status?: StudentStatus | null;
  enrolled_at?: string | null;
  note?: string | null;
  auth_id?: string | null;
}


export interface StudentOut {
  id: string;
  student_code: string;
  auth_id: string | null;
  first_name: string;
  last_name: string;
  full_name: string;
  date_of_birth: string | null;
  age: number | null;
  gender: Gender | null;
  image_url: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  status: StudentStatus;
  enrolled_at: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
  created_by: UserRef | null;
  updated_by: UserRef | null;
}

export interface StudentBrief {
  id: string;
  student_code: string;
  full_name: string;
  image_url?: string | null;
  status: StudentStatus;
}

export interface StudentFilter {
  q?: string;
  status?: StudentStatus;
  gender?: Gender;
  page?: number;
  size?: number;
}

export interface StudentPage {
  items: StudentOut[];
  total: number;
  page: number;
  size: number;
}
