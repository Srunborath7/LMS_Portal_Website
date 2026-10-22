'use client';

import { useSyncExternalStore } from 'react';
import type { AuthRead, AuthUser } from '@/src/types/auth.types';
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  saveSession,
  userFromToken,
} from '@/src/lib/session';
import { authApi } from '@/src/services/auth';

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

function mapAuthReadToUser(account: AuthRead): AuthUser {
  return {
    id: account.id,
    name: account.username,
    email: account.email,
    role: account.role,
    permissions: [],
  };
}

let state: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

let hasInitialized = false;

export const authStore = {
  getState(): AuthState {
    return state;
  },

  setState(next: Partial<AuthState> | ((prev: AuthState) => Partial<AuthState>)): void {
    const update = typeof next === 'function' ? next(state) : next;
    state = {
      ...state,
      ...update,
      isAuthenticated: Boolean(update.token !== undefined ? update.token : state.token),
    };
    notify();
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  setUser(user: AuthUser | null): void {
    state = {
      ...state,
      user,
    };
    notify();
  },

  setTokens(token: string | null, refreshToken?: string | null): void {
    const nextRefreshToken = refreshToken !== undefined ? refreshToken : state.refreshToken;
    if (token) {
      saveSession(token, nextRefreshToken ?? '');
    } else {
      clearSession();
    }

    const decodedUser = token ? userFromToken(token) : null;

    state = {
      ...state,
      token,
      refreshToken: nextRefreshToken ?? null,
      user: decodedUser ?? (token ? state.user : null),
      isAuthenticated: Boolean(token),
    };
    notify();
  },

  setSession(token: string, refreshToken?: string, user?: AuthUser | null): void {
    saveSession(token, refreshToken ?? '');
    const fallbackUser = userFromToken(token);

    state = {
      ...state,
      token,
      refreshToken: refreshToken ?? null,
      user: user ?? fallbackUser,
      isAuthenticated: true,
      isLoading: false,
    };
    notify();
  },

  clearAuth(): void {
    clearSession();
    state = {
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    };
    notify();
  },

  async initialize(): Promise<void> {
    if (typeof window === 'undefined') return;

    const token = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!token) {
      state = {
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      };
      notify();
      return;
    }

    const decodedUser = userFromToken(token);
    state = {
      ...state,
      token,
      refreshToken,
      user: decodedUser,
      isAuthenticated: true,
      isLoading: true,
    };
    notify();

    try {
      const account = await authApi.me();
      state = {
        ...state,
        user: mapAuthReadToUser(account),
        isLoading: false,
      };
      notify();
    } catch {
      // If token expired or invalid and cannot refresh, reset session
      if (!getAccessToken()) {
        authStore.clearAuth();
      } else {
        state = {
          ...state,
          isLoading: false,
        };
        notify();
      }
    }
  },
};

/**
 * Initialize on the client once upon import
 */
if (typeof window !== 'undefined' && !hasInitialized) {
  hasInitialized = true;
  authStore.initialize();
}

/**
 * React hook to subscribe to auth store state
 */
export function useAuthStore(): AuthState;
export function useAuthStore<T>(selector: (state: AuthState) => T): T;
export function useAuthStore<T>(selector?: (state: AuthState) => T): T | AuthState {
  const getSnapshot = () => (selector ? selector(state) : state);
  const getServerSnapshot = () =>
    selector
      ? selector({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        })
      : {
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        };

  return useSyncExternalStore(authStore.subscribe, getSnapshot, getServerSnapshot);
}
