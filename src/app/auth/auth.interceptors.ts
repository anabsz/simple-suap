import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Rotas que não devem receber o header Authorization nem disparar
 * tentativa de refresh — evita loop infinito de 401 -> refresh -> 401.
 */

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const accessToken = authService.getAccessToken();

  const authReq =
    accessToken 
      ? req.clone({
          setHeaders: { Authorization: `Bearer ${accessToken}` },
        })
      : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const semTokenParaRenovar = !authService.getRefreshToken();

      if (error.status !== 401  || semTokenParaRenovar) {
        return throwError(() => error);
      }

      // Access token expirado: tenta renovar uma vez e refaz a requisição original.
      return authService.refresh().pipe(
        switchMap(() => {
          const novoToken = authService.getAccessToken();
          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${novoToken}` },
          });
          return next(retryReq);
        }),
        catchError((refreshError) => {
          authService.logout();
          router.navigate(['/login']);
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};