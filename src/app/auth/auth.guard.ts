import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';  
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Considera autenticado se houver um access token salvo. 
  if (authService.getAccessToken()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};