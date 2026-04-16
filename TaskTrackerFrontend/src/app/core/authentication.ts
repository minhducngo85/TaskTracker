import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Authentication {
  private api = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

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
          console.log(res.token);
          localStorage.setItem('token', res.token);
        }
      }),
    );
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
  }
}
