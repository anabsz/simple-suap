export interface LoginSubmit {
  username: string;
  password: string;
}

/**
 * Resposta de POST /auth/pair (login).
 */
export interface TokenPair {
  access: string;
  refresh: string;
}

/**
 * Resposta de POST /auth/refresh.
 */
export interface RefreshResponse {
  access: string;
  refresh: string;
}

/**
 * Resposta de GET /auth/me.
 */
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}