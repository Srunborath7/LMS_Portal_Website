'use client';

import type { AuthUser } from '@/src/types/auth.types';


const ACCESS_KEY = 'fp_access_token';
const REFRESH_KEY = 'fp_refresh_token';
const COOKIE_NAME = 'auth-token';
// The proxy only checks the cookie exists; keep it tiny so a large JWT (many
// permissions) can never overflow the browser's per-cookie size limit.
const COOKIE_PRESENCE_VALUE = '1';

export interface JwtPayload {
  sub: string;
  role?: string;
  role_id?: number;
  permissions?: string[];
  full_name?: string;
  exp?: number;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const part = token.split('.')[1];
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function isExpired(payload: JwtPayload | null): boolean {
  if (!payload?.exp) return false;
  return payload.exp * 1000 <= Date.now();
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function saveSession(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  document.cookie = `${COOKIE_NAME}=${COOKIE_PRESENCE_VALUE}; path=/; max-age=604800; SameSite=Lax`;
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * Build an AuthUser from the access-token payload. Email is not present in the
 * JWT, so callers should enrich it from `/auths/me` when available.
 */
export function userFromToken(token: string): AuthUser | null {
  const payload = decodeJwt(token);
  if (!payload || isExpired(payload)) return null;
  return {
    id: payload.sub,
    name: payload.full_name ?? '',
    email: '',
    role: payload.role ?? '',
    roleId: payload.role_id,
    permissions: payload.permissions ?? [],
  };
}
