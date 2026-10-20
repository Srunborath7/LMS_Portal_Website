import { ApiError } from '@/src/types/api.types';
import { logger } from '@/src/lib/logger';
import { getAccessToken } from '@/src/lib/session';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

async function request<T>(method: string, path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const token = getAccessToken();

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    // The auth service returns `{ code, msg, data }`; other backends may use
    // `{ code, message, details }`. Support both.
    let errorBody: {
      code?: string | number;
      message?: string;
      msg?: string;
      details?: Record<string, string[]>;
    } = {};
    try {
      errorBody = await response.json();
    } catch {
      // non-JSON error body
    }
    const error = new ApiError(
      response.status,
      String(errorBody.code ?? 'UNKNOWN_ERROR'),
      errorBody.message ?? errorBody.msg ?? `HTTP ${response.status}`,
      errorBody.details
    );
    logger.error('API request failed', { url, status: response.status, code: error.code });
    throw error;
  }

  return response.json() as Promise<T>;
}

export const httpClient = {
  get:    <T>(path: string, options?: RequestInit) => request<T>('GET', path, options),
  post:   <T>(path: string, body: unknown, options?: RequestInit) =>
    request<T>('POST', path, { ...options, body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown, options?: RequestInit) =>
    request<T>('PUT', path, { ...options, body: JSON.stringify(body) }),
  patch:  <T>(path: string, body: unknown, options?: RequestInit) =>
    request<T>('PATCH', path, { ...options, body: JSON.stringify(body) }),
  delete: <T>(path: string, options?: RequestInit) => request<T>('DELETE', path, options),
};
