import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Task } from '../models/Task';
import { Observable } from 'rxjs';
import { PageResponse } from '../models/PageResponse';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private api = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getAllTasks() {
    return this.http.get<any[]>(`${this.api}/all`);
  }

  getTasks(params: any): Observable<PageResponse<Task>> {
    return this.http.get<PageResponse<Task>>(this.api, { params });
  }

  getAssigneeList() {
    return this.http.get<User[]>(`${this.api}/options/assignee`);
  }

  getStats(){
    return this.http.get<any>(`${this.api}/stats`);
  }

  addTask(task: any) {
    return this.http.post(this.api, task);
  }

  deleteTask(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }

  updateTask(id: number, task: any) {
    return this.http.put(`${this.api}/${id}`, task);
  }

  getTask(id: number) {
    return this.http.get<Task>(`${this.api}/${id}`);
  }
}
