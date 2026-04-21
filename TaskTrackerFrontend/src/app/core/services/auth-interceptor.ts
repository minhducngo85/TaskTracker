import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'console';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  //console.log('Interceptor chạy');
  const router = inject(Router);
  let token: string | null = null;

  // server → skip (Server-Side Rendering)
  if (typeof window === 'undefined') {
    return next(req);
  }

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  let modifiedReq = req;

  if (token) {
    const bearerToken = `Bearer ${token}`;
    modifiedReq = req.clone({
      setHeaders: {
        Authorization: bearerToken,
      },
    });
  }

  return next(modifiedReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }

      // Must return
      return throwError(() => error);
    }),
  );
};
