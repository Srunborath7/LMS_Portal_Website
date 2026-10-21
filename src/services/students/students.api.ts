import { httpClient } from '@/src/services/http/client';
import type {
  StudentCreate,
  StudentFilter,
  StudentOut,
  StudentPage,
  StudentStatus,
  StudentUpdate,
} from './students.types';

const STUDENTS_PATH = '/students';

export const studentsApi = {
  async list(filter?: StudentFilter): Promise<StudentPage> {
    const params = new URLSearchParams();
    if (filter?.q) params.set('q', filter.q);
    if (filter?.status) params.set('status', filter.status);
    if (filter?.gender) params.set('gender', filter.gender);
    if (filter?.page) params.set('page', String(filter.page));
    if (filter?.size) params.set('size', String(filter.size));

    const query = params.toString();
    const endpoint = query ? `${STUDENTS_PATH}?${query}` : STUDENTS_PATH;
    return httpClient.get<StudentPage>(endpoint);
  },

  async getById(id: string): Promise<StudentOut> {
    return httpClient.get<StudentOut>(`${STUDENTS_PATH}/${id}`);
  },

  async create(payload: StudentCreate): Promise<StudentOut> {
    return httpClient.post<StudentOut>(STUDENTS_PATH, payload);
  },

  async update(id: string, payload: StudentUpdate): Promise<StudentOut> {
    return httpClient.patch<StudentOut>(`${STUDENTS_PATH}/${id}`, payload);
  },

  async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`${STUDENTS_PATH}/${id}`);
  },

  async updateStatus(id: string, status: StudentStatus): Promise<StudentOut> {
    return httpClient.patch<StudentOut>(`${STUDENTS_PATH}/${id}/status`, { status });
  },

  async restore(id: string): Promise<StudentOut> {
    return httpClient.post<StudentOut>(`${STUDENTS_PATH}/${id}/restore`, {});
  },
};
