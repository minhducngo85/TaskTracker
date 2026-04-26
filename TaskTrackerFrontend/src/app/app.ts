import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { Authentication } from './core/services/authentication';
import { CommonModule } from '@angular/common';
import { LoggerService } from './core/services/logger-service';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from './core/services/task-service';
import { AddTaskDialog } from './feature/view/add-task-dialog/add-task-dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('TaskTrackerFrontend');

  constructor(
    private router: Router,
    public auth: Authentication,
    private logger: LoggerService,
    private dialog: MatDialog,
    private taskService: TaskService,
  ) {}

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  openAddTaskDialog() {
    const dialogRef = this.dialog.open(AddTaskDialog, {
      width: '600px',
      data: {
        assignees: [],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('New task:', result);

        // 👉 call API
        this.taskService.addTask(result).subscribe({
          next: (saved) => {
            this.goToDetail(saved.id);
          },
          error: (err: any) => {
            this.logger.error(err.toString());
          },
        });
      }
    });
  }

  goToDetail(id: number) {
    this.router.navigate(['/tasks', id]);
  }
}
