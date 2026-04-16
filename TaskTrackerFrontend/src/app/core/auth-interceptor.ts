import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Interceptor chạy');

  let token: string | null = null;

   // 👇 nếu chạy server → skip (Server-Side Rendering)
  if (typeof window === 'undefined') {
    return next(req);
  }

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  let modifiedReq = req;

  if (token) {
    const bearerToken = `Bearer ${token}`;
    console.log(bearerToken);
    modifiedReq = req.clone({
      setHeaders: {
        Authorization: bearerToken
      },
    });
  }

  // 🔥 LOG ALL HEADERS
  
  console.log('=== REQUEST HEADERS ===');

  modifiedReq.headers.keys().forEach(key => {
    console.log(key + ':', modifiedReq.headers.get(key));
  });

  console.log('======================');

  return next(modifiedReq);
};
