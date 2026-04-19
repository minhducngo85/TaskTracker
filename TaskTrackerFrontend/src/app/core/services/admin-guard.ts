import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Authentication } from './authentication';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(Authentication);

  if (auth.isAdmin()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
