import { httpClient } from "@/src/services/http/client";
import { clearSession, getRefreshToken, saveSession } from "@/src/lib/session";
import type { AuthCreate, AuthLogin, AuthRead, AuthToken } from "./type";

const AUTH_PATH = "/auths";

function storeSession(session: AuthToken): void {
  // The backend schema currently guarantees the access token only. Keep an
  // existing refresh token if login/refresh responses omit it.
  const refreshToken = session.refresh_token ?? getRefreshToken();
  saveSession(session.access_token, refreshToken ?? "");
}

export const authApi = {
  async register(payload: AuthCreate): Promise<AuthRead> {
    return httpClient.post<AuthRead>(`${AUTH_PATH}/register`, payload);
  },

  async login(payload: AuthLogin): Promise<AuthToken> {
    const session = await httpClient.post<AuthToken>(
      `${AUTH_PATH}/login`,
      payload,
    );
    storeSession(session);
    return session;
  },

  me(): Promise<AuthRead> {
    return httpClient.get<AuthRead>(`${AUTH_PATH}/me`);
  },

  async refresh(): Promise<AuthToken> {
    const refreshToken = getRefreshToken();
    const session = await httpClient.post<AuthToken>(`${AUTH_PATH}/refresh`, {
      refresh_token: refreshToken,
    });
    storeSession(session);
    return session;
  },

  async logout(): Promise<void> {
    try {
      await httpClient.post<void>(`${AUTH_PATH}/logout`, {});
    } finally {
      clearSession();
    }
  },
};
