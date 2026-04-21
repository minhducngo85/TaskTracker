import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'console';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { Authentication } from './authentication';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // console.log('Interceptor chạy');
  const router = inject(Router);
  const authService = inject(Authentication);

  // server → skip (Server-Side Rendering)
  if (typeof window === 'undefined') {
    return next(req);
  }

  let token = localStorage.getItem('token');
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
      // 🚫 Nếu request đã có flag skip → không xử lý nữa
      if (modifiedReq.headers.get('x-skip-refresh') === 'true') {
        return throwError(() => error);
      }

      // 🚫 Nếu là request refresh → logout luôn
      if (modifiedReq.url.includes('/refresh')) {
        console.log('Refresh API failed → logout');

        localStorage.clear();
        router.navigate(['/login']);

        return throwError(() => error);
      }

      if (error.status === 401) {
        console.log('Error 401 → try refresh');
        return authService.refreshToken().pipe(
          switchMap(() => {
            const newToken = localStorage.getItem('token');

            const newReq = modifiedReq.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`,
                'x-skip-refresh': 'true', // 🔥 mark đã retry
              },
            });

            // 🔥 retry request
            return next(newReq);
          }),
          catchError((err) => {
            console.log('Refresh failed → logout');
            localStorage.clear();
            router.navigate(['/login']);
            return throwError(() => err);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};
