import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private api = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) {}

  getTasks() {
    return this.http.get<any[]>(this.api);
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
}
