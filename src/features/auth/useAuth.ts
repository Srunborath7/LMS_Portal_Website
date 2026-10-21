'use client';

import { useCallback, useEffect, useState } from 'react';
import { authApi } from '@/src/services/auth';
import type { AuthCreate, AuthLogin, AuthRead, AuthUser } from '@/src/types/auth.types';
import { clearSession, getAccessToken, userFromToken } from '@/src/lib/session';

function mapUser(user: AuthRead): AuthUser {
  return {
    id: user.id,
    name: user.username,
    email: user.email,
    role: user.role,
    permissions: [],
  };
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    const cachedUser = userFromToken(token);
    if (cachedUser) setUser(cachedUser);
    authApi.me().then((account) => setUser(mapUser(account))).catch(() => {
      clearSession();
      setUser(null);
    });
  }, []);

  const login = useCallback(async (payload: AuthLogin) => {
    setLoading(true);
    setError('');
    try {
      const session = await authApi.login(payload);
      setUser(mapUser(session.user));
      return true;
    } catch {
      setError('Unable to sign in. Check your details and try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: AuthCreate) => {
    setLoading(true);
    setError('');
    try {
      await authApi.register(payload);
      return true;
    } catch {
      setError('Unable to create your account. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(''), []);

  return { user, loading, error, login, register, logout, clearError };
}
