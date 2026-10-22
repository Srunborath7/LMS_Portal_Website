import { ApiError } from '@/src/types/api.types';
import { logger } from '@/src/lib/logger';
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  saveSession,
} from '@/src/lib/session';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
const AUTH_REFRESH_PATH = '/auths/refresh';

type RefreshResponse = {
  access_token?: string;
  refresh_token?: string;
};

let refreshInFlight: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) return null;

      const response = await fetch(`${BASE_URL}${AUTH_REFRESH_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (!response.ok) return null;

      const session = (await response.json()) as RefreshResponse;
      if (!session.access_token) return null;

      saveSession(session.access_token, session.refresh_token ?? refreshToken);
      return session.access_token;
    } catch {
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

async function request<T>(method: string, path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const fetchWithToken = (token: string | null) => fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });

  const shouldSkipRefresh = [
    '/auths/login',
    '/auths/register',
    '/auths/forgot-password',
    '/auths/reset-password',
    AUTH_REFRESH_PATH,
    '/auths/logout',
  ].some((authPath) => path === authPath || path.startsWith(`${authPath}?`));

  let response = await fetchWithToken(getAccessToken());

  if (response.status === 401 && !shouldSkipRefresh) {

    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      response = await fetchWithToken(refreshedToken);
      if (response.status === 401) clearSession();
    } else {
      clearSession();
    }
  }

  if (!response.ok) {
    // The auth service returns `{ code, msg, data }`; other backends may use
    // `{ code, message, details }`. Support both.
    let errorBody: {
      code?: string | number;
      message?: string;
      msg?: string;
      detail?: string;
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
      errorBody.message ?? errorBody.msg ?? errorBody.detail ?? `HTTP ${response.status}`,
      errorBody.details
    );

    logger.error('API request failed', { url, status: response.status, code: error.code });
    throw error;
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null as unknown as T;
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
