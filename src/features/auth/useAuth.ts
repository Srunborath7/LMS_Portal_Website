'use client';

import { useCallback, useState } from 'react';
import { authApi } from '@/src/services/auth';
import type { AuthCreate, AuthLogin } from '@/src/types/auth.types';
import { authStore, useAuthStore } from '@/src/store';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isStoreLoading = useAuthStore((s) => s.isLoading);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const loading = actionLoading || isStoreLoading;

  const login = useCallback(async (payload: AuthLogin) => {
    setActionLoading(true);
    setError('');
    try {
      const session = await authApi.login(payload);
      authStore.setSession(session.access_token, session.refresh_token, {
        id: session.user.id,
        name: session.user.username,
        email: session.user.email,
        role: session.user.role,
        permissions: [],
      });
      return true;
    } catch {
      setError('Unable to sign in. Check your details and try again.');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: AuthCreate) => {
    setActionLoading(true);
    setError('');
    try {
      await authApi.register(payload);
      return true;
    } catch {
      setError('Unable to create your account. Please try again.');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      authStore.clearAuth();
    }
  }, []);

  const clearError = useCallback(() => setError(''), []);

  return { user, loading, error, login, register, logout, clearError };
}
