/** Role assigned to an authenticated account by the backend. */
export type AuthRole = string;

/** User shape used by the client after decoding an access token. */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  roleId?: number;
  permissions: string[];
}

/** Request payload for creating an account. */
export interface AuthCreate {
  username: string;
  email: string;
  password: string;
}

/** Request payload for signing in. */
export interface AuthLogin {
  email: string;
  password: string;
}

/** Public account fields returned by the API. */
export interface AuthRead {
  id: string;
  username: string;
  email: string;
  role: AuthRole;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

/** Refresh-token metadata returned by the API. */
export interface RefreshTokenRead {
  id: string;
  auth_id: string;
  expires_at: string;
  revoked_at: string | null;
  created_at: string;
}

/** Login or refresh response. */
export interface AuthToken {
  access_token: string;
  token_type: string;
  user: AuthRead;
  /** Optional for deployments that return refresh tokens in the response. */
  refresh_token?: string;
}

/** Full auth account representation from /api/v1/auths. */
export interface AuthOut {
  id: string;
  username: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  failed_login_attempts: number;
  locked_until: string | null;
  last_login_at: string | null;
  created_at: string;
}

/** Paginated list of auth accounts. */
export interface AuthPage {
  items: AuthOut[];
  total: number;
  page: number;
  size: number;
}

/** Query filter for listing auth accounts. */
export interface AuthFilter {
  q?: string;
  is_active?: boolean;
  page?: number;
  size?: number;
}

/** Request payload for requesting a password reset token. */
export interface PasswordResetRequest {
  email: string;
}

/** Request payload for confirming password reset with token. */
export interface PasswordResetConfirm {
  token: string;
  new_password: string;
}


