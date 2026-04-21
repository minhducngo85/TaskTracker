import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  
  private _context : string = 'APP';

  set context(value: string) {
    this._context = value || 'APP';
  }

  get context() {
    return this._context;
  }
   
  log(message: string, data?: any): void {
    if (environment.production) {
      return;
    }
    console.log(`[LOG][${this._context}] ${message},`, data ?? ``);
  }

  info(message: string, data?: any): void {
    if (environment.production) {
      return;
    }
    console.info(`[INFO][${this._context}]' ${message},`, data ?? ``);
  }

  warn(message: string, data?: any): void {
    if (environment.production) {
      return;
    }
    console.log(`[WARN][${this._context}]' ${message},`, data ?? ``);
  }

  error(message: string, error?: any): void {
    if (environment.production) {
      return;
    }
    console.log(`[ERROR][${this._context}]' ${message},`, error ?? ``);
  }

  debug(message: string, data?: any): void {
    if (environment.production) {
      return;
    }
    console.log(`[DEBUG][${this._context}]' ${message},`, data ?? ``);
  }

  logToServer(message: string, data?: any) {
    // call API
    // this.http.post('/api/logs', { message, data }).subscribe();
  }
}
