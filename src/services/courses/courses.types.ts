export type CourseLevel =
  | 'beginner'
  | 'elementary'
  | 'intermediate'
  | 'upper_intermediate'
  | 'advanced'
  | 'all_levels';

export type CourseStatus = 'draft' | 'published' | 'archived';

export interface CourseBase {
  name: string;
  description?: string | null;
  objectives?: string | null;
  category?: string | null;
  level?: CourseLevel;
  language?: string;
  thumbnail_url?: string | null;
  duration_hours?: number | string | null;
  fee?: number | string;
  currency?: string;
}

export interface CourseCreate extends CourseBase {
  name: string;
}

export interface CourseUpdate {
  name?: string | null;
  description?: string | null;
  objectives?: string | null;
  category?: string | null;
  level?: CourseLevel | null;
  language?: string | null;
  thumbnail_url?: string | null;
  duration_hours?: number | string | null;
  fee?: number | string | null;
  currency?: string | null;
}

export interface CourseOut {
  id: string;
  course_code: string;
  name: string;
  description: string | null;
  objectives: string | null;
  category: string | null;
  level: CourseLevel;
  language: string;
  thumbnail_url: string | null;
  duration_hours: string | null;
  fee: string;
  currency: string;
  status: CourseStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  created_by_id: string | null;
  updated_by_id: string | null;
}

export interface CourseBrief {
  id: string;
  course_code: string;
  name: string;
  level: CourseLevel;
  status: CourseStatus;
}

export interface CoursePublic {
  id: string;
  course_code: string;
  name: string;
  description: string | null;
  objectives: string | null;
  category: string | null;
  level: CourseLevel;
  language: string;
  thumbnail_url: string | null;
  duration_hours: string | null;
  fee: string;
  currency: string;
}

export interface CourseFilter {
  q?: string;
  status?: CourseStatus;
  level?: CourseLevel;
  category?: string;
  language?: string;
  min_fee?: number | string;
  max_fee?: number | string;
  page?: number;
  size?: number;
}

export interface CourseCatalogFilter {
  q?: string;
  status?: CourseStatus;
  level?: CourseLevel;
  category?: string;
  language?: string;
  min_fee?: number | string;
  max_fee?: number | string;
  page?: number;
  size?: number;
}

export interface CoursePage {
  items: CourseOut[];
  total: number;
  page: number;
  size: number;
}

export interface CoursePublicPage {
  items: CoursePublic[];
  total: number;
  page: number;
  size: number;
}
