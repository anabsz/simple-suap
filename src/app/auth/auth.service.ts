import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../env';
import {
  AuthUser,
  LoginSubmit,
  RefreshResponse,
  TokenPair,
} from './auth.model';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly userSignal = signal<AuthUser | null>(null);
  readonly user = computed(() => this.userSignal());
  readonly isAuthenticated = computed(() => this.userSignal() !== null);

  login(payload: LoginSubmit): Observable<TokenPair> {
    return this.http.post<TokenPair>(`${this.apiUrl}/pair`, payload).pipe(
      tap((tokens) => this.storeTokens(tokens)),
    );
  }

  /**
   * Busca os dados do usuário autenticado (GET /auth/me) e popula o
   * signal local. Chame após login bem-sucedido ou no bootstrap da
   * aplicação para restaurar a sessão a partir do token salvo.
   */
  loadCurrentUser(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.apiUrl}/me`).pipe(
      tap((user) => this.userSignal.set(user)),
    );
  }

  refresh(): Observable<RefreshResponse> {
    const refreshToken = this.getRefreshToken();

    return this.http
      .post<RefreshResponse>(`${this.apiUrl}/refresh`, {
        refresh: refreshToken,
      })
      .pipe(tap((tokens) => this.storeTokens(tokens)));
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.userSignal.set(null);

  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  private storeTokens(tokens: TokenPair | RefreshResponse): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
  }
}