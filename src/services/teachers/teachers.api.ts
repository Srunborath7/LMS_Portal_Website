import { httpClient } from '@/src/services/http/client';
import type {
  TeacherCreate,
  TeacherFilter,
  TeacherOut,
  TeacherPage,
  TeacherStatus,
  TeacherUpdate,
} from './teachers.type';

const TEACHERS_PATH = '/teachers';

export const teachersApi = {
  async list(filter?: TeacherFilter): Promise<TeacherPage> {
    const params = new URLSearchParams();
    if (filter?.q) params.set('q', filter.q);
    if (filter?.status) params.set('status', filter.status);
    if (filter?.employment_type) params.set('employment_type', filter.employment_type);
    if (filter?.specialization) params.set('specialization', filter.specialization);
    if (filter?.page) params.set('page', String(filter.page));
    if (filter?.size) params.set('size', String(filter.size));

    const query = params.toString();
    const endpoint = query ? `${TEACHERS_PATH}?${query}` : TEACHERS_PATH;
    return httpClient.get<TeacherPage>(endpoint);
  },

  async getById(id: string): Promise<TeacherOut> {
    return httpClient.get<TeacherOut>(`${TEACHERS_PATH}/${id}`);
  },

  async create(payload: TeacherCreate): Promise<TeacherOut> {
    return httpClient.post<TeacherOut>(TEACHERS_PATH, payload);
  },

  async update(id: string, payload: TeacherUpdate): Promise<TeacherOut> {
    return httpClient.patch<TeacherOut>(`${TEACHERS_PATH}/${id}`, payload);
  },

  async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`${TEACHERS_PATH}/${id}`);
  },

  async updateStatus(id: string, status: TeacherStatus): Promise<TeacherOut> {
    return httpClient.patch<TeacherOut>(`${TEACHERS_PATH}/${id}/status`, { status });
  },

  async restore(id: string): Promise<TeacherOut> {
    return httpClient.post<TeacherOut>(`${TEACHERS_PATH}/${id}/restore`, {});
  },
};
