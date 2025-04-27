import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);


  if (authService.isAuthenticated()) {
    return true;
  }

  const returnUrl = route.pathFromRoot
    .map(seg => seg.url.map(p => p.path).join('/'))
    .join('/') || '/';

  authService.setReturnUrl(returnUrl);
  router.navigate(['/quickplay']);
  return false;
};
