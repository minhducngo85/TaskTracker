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
import { Task } from '../../core/models/Task';
import { TaskFilter } from '../../core/models/TaskFilter';
import { LoggerService } from '../../core/services/logger-service';
import { User } from '../../core/models/User';

@Component({
  selector: 'app-task-component',
  imports: [FormsModule, CommonModule, TimeAgoPipe],
  templateUrl: './task-component.html',
  styleUrl: './task-component.css',
})
export class TaskComponent implements OnInit {
  // Loading indicator
  loading = true;

  // Priority Options
  priorityOptions = Object.values(TaskPriority);

  // Priority Options
  statusOptions = Object.values(TaskStatus);

  tasks: Task[] = [];
  total: number = 0;

  assigneeList: User[] = [];

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
  filters: TaskFilter = {
    title: '',
    status: '',
    priority: '',
    assignedTo: '',
  };

  // paginator
  page = 0;
  size = 10;

  // Sorting
  sortValue = '';

  // task to be edited
  editingTask: any = null;

  // Filter panel opened
  isFilterOpen: boolean = true;

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
    private logger: LoggerService,
  ) {
    this.logger.context = 'TaskComponent';
    this.logger.log('Constructor');
    //this.loadTasks();
  }

  /**
   * on init
   */
  ngOnInit(): void {
    this.logger.log('ngOnInit');

    if (window.innerWidth <= 768) {
      this.isFilterOpen = false; // mobile collapse
    }

    this.route.queryParams.subscribe((params) => {
      this.filters.status = params['status'] || '';
      this.filters.priority = params['priority']?.toUpperCase() || '';
      this.filters.assignedTo = params['assignedTo'] || '';
      this.sortValue = params['sort'] || '';
    });
    this.loadAssigneeList();
    this.applyFilter();
  }

  loadAssigneeList() {
     // read assignee list
    this.taskService.getAssigneeList().subscribe({
      next: (users) => {
        this.assigneeList = users;
        this.cdr.detectChanges(); // trigger ui update
      },
      error: (err) => {
        this.logger.error('Error to get assignee list', err);
        this.snackBar.open(`Error to get assignee list`, 'Close', {
          duration: 1000,
        });
        this.cdr.detectChanges();
      },
    });
  }
  loadTasks() {
    this.logger.log('loadTaks() called!');
    // get all task for filter and search at client
    // this.tasks$ = this.taskService.getAllTasks().pipe(
    //   tap({
    //     next: (tasks) => {
    //       // this.snackBar.open(tasks?.length + ' Tasks loaded', 'Close', {
    //       //   duration: 2000,
    //       // });
    //     },
    //     error: (err) => {
    //       this.snackBar.open('Error: ' + err, 'Close', {
    //         duration: 2000,
    //       });
    //     },
    //   }),
    //   shareReplay(1),
    // );

    // filtering and sorting at server side
    const params: any = {
      page: this.page,
      size: this.size,
      sort: this.sortValue,
      ...Object.fromEntries(
        Object.entries(this.filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''),
      ),
    };
    this.taskService.getTasks(params).subscribe({
      next: (res) => {
        this.tasks = res.content;
        this.total = res.totalElements;
        this.loading = false;
        this.snackBar.open(`${this.tasks?.length} / ${this.total} Tasks loaded`, 'Close', {
          duration: 1000,
        });
        this.cdr.detectChanges(); // trigger ui update
      },
      error: (err) => {
        this.logger.error('Error to get task list', err);
        this.snackBar.open(`Error to get task list`, 'Close', {
          duration: 1000,
        });
        this.cdr.detectChanges();
      },
    });
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
    this.loading = true;
    this.page = 0;
    this.loadTasks();

    // FIlter code by client side
    // this.tasks$ = this.taskService.getAllTasks().pipe(
    //   map((tasks) => {
    //     // Copy task to void mutable array while sorting
    //     let result = [...tasks];

    //     // Filter status
    //     if (this.filters.status) {
    //       result = result.filter((t) => t.status === this.filters.status);
    //     }

    //     // Filter priority
    //     if (this.filters.priority) {
    //       result = result.filter((t) => t.priority === this.filters.priority);
    //     }

    //     // Search by title
    //     if (this.filters.title) {
    //       result = result.filter((t) =>
    //         t.title.toLowerCase().includes(this.filters.title.toLowerCase()),
    //       );
    //     }

    //     // sorting
    //     if (this.sortValue === 'asc') {
    //       result = result.sort((a, b) => {
    //         return a.title.localeCompare(b.title);
    //       });
    //     } else if (this.sortValue === 'desc') {
    //       result = result.sort((a, b) => {
    //         return b.title.localeCompare(a.title);
    //       });
    //     } else if (this.sortValue === 'updatedAtAsc') {
    //       result = result.sort((a, b) => {
    //         return a.updatedAt.localeCompare(b.updatedAt);
    //       });
    //     } else if (this.sortValue === 'updatedAtDesc') {
    //       result = result.sort((a, b) => {
    //         return b.updatedAt.localeCompare(a.updatedAt);
    //       });
    //     }

    //     // show snack bar
    //     this.snackBar.open(result?.length + ' Task(s) found!', 'Close', {
    //       duration: 2000,
    //     });
    //     return result;
    //   }),
    // );
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
        this.applyFilter();
        this.cdr.detectChanges(); // trigger ui update
      },
      error: (err: any) => this.logger.error(err.toString()),
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
    this.filters.status = '';
    this.filters.priority = '';
    this.filters.title = '';
    this.filters.assignedTo = '';

    // Sorting
    this.sortValue = '';
    this.applyFilter();
  }

  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  /** paginator */
  get totalPages(): number {
    return Math.ceil(this.total / this.size);
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadTasks();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.loadTasks();
    }
  }

  /** goToPage listener in paginator */
  pageInput = 1;
  goToPage() {
    if (this.pageInput >= 1 && this.pageInput <= this.totalPages) {
      this.page = this.pageInput - 1;
      this.loadTasks();
    }
  }

  /**
   * Helper method to get assignee fullname
   */
  assigneeFullname(username?: string): string {
    if (username) {
      const user = this.assigneeList.find((u) => u.username === username);
      if (user) {
        return user.fullname;
      }
      return username;
    }
    return '';
  }
}
