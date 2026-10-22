import { httpClient } from '@/src/services/http/client';
import type {
  CourseBrief,
  CourseCatalogFilter,
  CourseCreate,
  CourseFilter,
  CourseOut,
  CoursePage,
  CoursePublic,
  CoursePublicPage,
  CourseUpdate,
} from './courses.types';

const COURSES_PATH = '/courses';

function buildQuery(filter?: CourseFilter | CourseCatalogFilter): string {
  if (!filter) return '';
  const params = new URLSearchParams();

  if (filter.q) params.set('q', filter.q);
  if (filter.status) params.set('status', filter.status);
  if (filter.level) params.set('level', filter.level);
  if (filter.category) params.set('category', filter.category);
  if (filter.language) params.set('language', filter.language);
  if (filter.min_fee !== undefined && filter.min_fee !== null && filter.min_fee !== '') {
    params.set('min_fee', String(filter.min_fee));
  }
  if (filter.max_fee !== undefined && filter.max_fee !== null && filter.max_fee !== '') {
    params.set('max_fee', String(filter.max_fee));
  }
  if (filter.page) params.set('page', String(filter.page));
  if (filter.size) params.set('size', String(filter.size));

  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const coursesApi = {
  async list(filter?: CourseFilter): Promise<CoursePage> {
    return httpClient.get<CoursePage>(`${COURSES_PATH}${buildQuery(filter)}`);
  },

  async catalog(filter?: CourseCatalogFilter): Promise<CoursePublicPage> {
    return httpClient.get<CoursePublicPage>(`${COURSES_PATH}/catalog${buildQuery(filter)}`);
  },

  async getCatalogById(courseId: string): Promise<CoursePublic> {
    return httpClient.get<CoursePublic>(`${COURSES_PATH}/catalog/${courseId}`);
  },

  async getById(courseId: string): Promise<CourseOut> {
    return httpClient.get<CourseOut>(`${COURSES_PATH}/${courseId}`);
  },

  async create(payload: CourseCreate): Promise<CourseOut> {
    return httpClient.post<CourseOut>(COURSES_PATH, payload);
  },

  async update(courseId: string, payload: CourseUpdate): Promise<CourseOut> {
    return httpClient.patch<CourseOut>(`${COURSES_PATH}/${courseId}`, payload);
  },

  async delete(courseId: string): Promise<void> {
    return httpClient.delete<void>(`${COURSES_PATH}/${courseId}`);
  },

  async publish(courseId: string): Promise<CourseOut> {
    return httpClient.post<CourseOut>(`${COURSES_PATH}/${courseId}/publish`, {});
  },

  async unpublish(courseId: string): Promise<CourseOut> {
    return httpClient.post<CourseOut>(`${COURSES_PATH}/${courseId}/unpublish`, {});
  },

  async archive(courseId: string): Promise<CourseOut> {
    return httpClient.post<CourseOut>(`${COURSES_PATH}/${courseId}/archive`, {});
  },

  async restore(courseId: string): Promise<CourseOut> {
    return httpClient.post<CourseOut>(`${COURSES_PATH}/${courseId}/restore`, {});
  },

  async getOptions(): Promise<CourseBrief[]> {
    return httpClient.get<CourseBrief[]>(`${COURSES_PATH}/options`);
  },

  async getCategories(): Promise<string[]> {
    return httpClient.get<string[]>(`${COURSES_PATH}/categories`);
  },
};
