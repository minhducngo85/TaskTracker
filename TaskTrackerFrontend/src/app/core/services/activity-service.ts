import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private api = `${environment.apiUrl}/activities`;

  constructor(private http: HttpClient) {}

  getActivites(page: number, size: number) {
    return this.http.get<any>(`${this.api}?page=${page}&size=${size}`);
  }

  getMyActivites(page: number, size: number) {
    return this.http.get<any>(`${this.api}/mine?page=${page}&size=${size}`);
  }
}
