import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../core/services/task-service';
import { CommonModule } from '@angular/common';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { Authentication } from '../../core/services/authentication';
import { TaskPriority } from '../../core/models/TaskPriority';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'console';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskStatus } from '../../core/models/TaskStatus';
import { TimeAgoPipe } from '../../core/pipe/TimeAgoPipe';

@Component({
  selector: 'app-task-component',
  imports: [FormsModule, CommonModule, TimeAgoPipe],
  templateUrl: './task-component.html',
  styleUrl: './task-component.css',
})
export class TaskComponent implements OnInit {
  // Priority Options
  priorityOptions = Object.values(TaskPriority);

  // Priority Options
  statusOptions = Object.values(TaskStatus);

  // 🔥 dùng Observable thay vì array
  tasks$!: Observable<any[]>;

  // show add form
  showForm = false;

  // new task obj
  newTask = {
    title: '',
    description: '',
    assignedTo: 'mngo',
    status: 'TODO',
    priority: 'LOW',
  };

  // filter and search
  filterValue = '';
  filterPriorityValue = '';
  searchValue = '';

  // Sorting
  sortValue = '';

  // task to be edited
  editingTask: any = null;

  /**
   *
   * @param taskService Constructor to inject dependencies
   * @param cdr
   * @param auth
   * @param route
   * @param router
   */
  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
    public auth: Authentication,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    console.log('Constructor');
    this.loadTasks();
  }

  /**
   * on init
   */
  ngOnInit(): void {
    console.log('ngOnInit');
    this.route.queryParams.subscribe((params) => {
      this.filterValue = params['status'] || '';
      this.filterPriorityValue = params['priority']?.toUpperCase() || '';
    });
    this.applyFilter();
  }

  loadTasks() {
    this.tasks$ = this.taskService.getTasks().pipe(
      tap({
        next: (tasks) => {
          // this.snackBar.open(tasks?.length + ' Tasks loaded', 'Close', {
          //   duration: 2000,
          // });
        },
        error: (err) => {
          this.snackBar.open('Error: ' + err, 'Close', {
            duration: 2000,
          });
        },
      }),
      shareReplay(1),
    );
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  addTask(form: any) {
    if (form.invalid) return;

    this.taskService.addTask(this.newTask).subscribe({
      next: () => {
        this.toggleForm();
        this.newTask = {
          title: '',
          description: '',
          assignedTo: 'mngo',
          status: 'TODO',
          priority: 'LOW',
        };
        this.loadTasks();
        form.resetForm();

        this.snackBar.open('Task added', 'Close', {
          duration: 2000,
        });
      },
      error: (err: any) => {
        console.error(err);
        this.snackBar.open('Error: ' + err, 'Close', {
          duration: 2000,
        });
      },
    });
  }

  deleteTask(id: number) {
    if (!confirm('Are you sure to delete this task?')) return;

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.loadTasks(); // 👈 assign trực tiếp
        this.cdr.detectChanges(); // trigger ui update
        this.snackBar.open(`Task id ${id} deleted`, 'Close', {
          duration: 2000,
        });
      },
      error: (err: any) => console.error(err),
    });
  }

  /**
   *
   */
  applyFilter() {
    this.tasks$ = this.taskService.getTasks().pipe(
      map((tasks) => {
        // Copy task to void mutable array while sorting
        let result = [...tasks];

        // Filter status
        if (this.filterValue) {
          result = result.filter((t) => t.status === this.filterValue);
        }

        // Filter priority
        if (this.filterPriorityValue) {
          result = result.filter((t) => t.priority === this.filterPriorityValue);
        }

        // Search by title
        if (this.searchValue) {
          result = result.filter((t) =>
            t.title.toLowerCase().includes(this.searchValue.toLowerCase()),
          );
        }

        // sorting
        if (this.sortValue === 'asc') {
          result = result.sort((a, b) => {
            return a.title.localeCompare(b.title);
          });
        } else if (this.sortValue === 'desc') {
          result = result.sort((a, b) => {
            return b.title.localeCompare(a.title);
          });
        } else if (this.sortValue === 'updatedAtAsc') {
          result = result.sort((a, b) => {
            return a.updatedAt.localeCompare(b.updatedAt);
          });
        } else if (this.sortValue === 'updatedAtDesc') {
          result = result.sort((a, b) => {
            return b.updatedAt.localeCompare(a.updatedAt);
          });
        }

        // show snack bar
        this.snackBar.open(result?.length + ' Task(s) found!', 'Close', {
          duration: 2000,
        });
        return result;
      }),
    );
  }

  /** start edit */
  startEdit(task: any) {
    // clone task
    this.editingTask = { ...task };
  }

  cancelEdit() {
    this.editingTask = null;
  }

  saveEdit() {
    console.log(JSON.stringify(this.editingTask, null, 2));
    this.taskService.updateTask(this.editingTask.id, this.editingTask).subscribe({
      next: () => {
        this.editingTask = null;
        this.loadTasks();
        this.cdr.detectChanges(); // trigger ui update
      },
      error: (err: any) => console.error(err),
    });
  }

  /**
   *
   * @param priority
   * @returns
   *  css clas for priority
   */
  getPriorityClass(priority: string) {
    switch (priority) {
      case 'CRITICAL':
        return 'badge badge-critical'; // red
      case 'HIGH':
        return 'badge badge-high'; // orange (custom)
      case 'MEDIUM':
        return 'badge badge-medium'; // yellow
      case 'LOW':
        return 'badge badge-low'; // green
      default:
        return 'badge badge-default';
    }
  }

  /**
   *
   * @param p priority emoji
   * @returns
   */
  getPriorityEmoji(p: TaskPriority): string {
    switch (p) {
      case 'CRITICAL':
        return '🔴';
      case 'HIGH':
        return '🟠';
      case 'MEDIUM':
        return '🟡';
      default:
        return '🟢';
    }
  }

  /**
   *
   * @param p priority emoji
   * @returns
   */
  getStatusEmoji(s: TaskStatus): string {
    switch (s) {
      case 'DONE':
        return '🟢';
      case 'IN_PROGRESS':
        return '🟠';
      default:
        return '⚪';
    }
  }

  clearFilter() {
    // filter and search
    this.filterValue = '';
    this.filterPriorityValue = '';
    this.searchValue = '';

    // Sorting
    this.sortValue = '';
    this.applyFilter();
  }
}
