import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Route, Router } from '@angular/router';
import { LoggerService } from './logger-service';

@Injectable({
  providedIn: 'root',
})
export class Authentication {
  private api = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private logger: LoggerService,
  ) {
    this.logger.context = 'Authentication';
  }

  /**
   *
   * @param data to login
   * @returns
   */
  login(data: any) {
    return this.http.post<any>(`${this.api}/login`, data).pipe(
      // tap: don't modify data
      tap((res) => {
        if (typeof window !== 'undefined') {
          // console.log(res.token);
          localStorage.setItem('token', res.token);
          localStorage.setItem('refreshToken', res.refreshToken);
          // console.log(res.token);
          //this.logger.log(res.token);
          //this.logger.log(res.refreshToken);
        }
      }),
    );
  }

  refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    this.logger.log(`refreshToken(): ${refreshToken}`);
    return this.http.post<any>(`${this.api}/refresh`, refreshToken).pipe(
      tap((res) => {
        this.logger.log(`set new token: ${res.token}`);
        localStorage.setItem('token', res.token);
      }),
    );
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  /**
   *
   * @returns to get token of current login session
   */
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    this.router.navigate(['/login']);
  }

  /**
   *
   * @returns returns role from access token
   */
  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    //console.log(payload);
    return payload.role;
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // tuỳ backend bạn đặt field gì
      return payload.sub || payload.username || payload.email || null;
    } catch (e) {
      return null;
    }
  }
}
