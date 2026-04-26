import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Task } from '../models/Task';
import { Observable } from 'rxjs';
import { PageResponse } from '../models/PageResponse';
import { User } from '../models/User';
import { TaskComment } from '../models/TaskComment';

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

  getStats() {
    return this.http.get<any>(`${this.api}/stats`);
  }

  addTask(task: any) {
    return this.http.post<Task>(this.api, task);
  }

  deleteTask(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }

  updateTask(id: number, task: any) {
    return this.http.put<Task>(`${this.api}/${id}`, task);
  }

  getTask(id: number) {
    return this.http.get<Task>(`${this.api}/${id}`);
  }

  getAllTags() {
    return this.http.get<any[]>(`${this.api}/tags`);
  }

  getTopTags() {
    return this.http.get<any[]>(`${this.api}/tags/top?limit=20`);
  }

  getComments(taskId: Number, page: number, size: number) {
    return this.http.get<any>(`${this.api}/${taskId}/comments?page=${page}&size=${size}`);
  }

  getHistory(taskId: Number, page: number, size: number) {
    return this.http.get<any>(`${this.api}/${taskId}/history?page=${page}&size=${size}`);
  }

  addComment(taskId: Number, content: string) {
    return this.http.post<TaskComment[]>(`${this.api}/${taskId}/comments`, { content: content });
  }

  getMyWork() {
    return this.http.get<any>(`${this.api}/my-work`);
  }

  getMyActiveTasks() {
    return this.http.get<any[]>(`${this.api}/my-tasks`);
  }

  getCompleteTasks(){
    return this.http.get<any[]>(`${this.api}/complete-tasks`);
  }
}
