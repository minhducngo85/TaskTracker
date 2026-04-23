import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TaskService } from '../../core/services/task-service';
import { Task } from '../../core/models/Task';
import { TaskStatus } from '../../core/models/TaskStatus';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../../core/pipe/TimeAgoPipe';
import { filter, switchMap } from 'rxjs';
import { LoggerService } from '../../core/services/logger-service';
import { TaskFilter } from '../../core/models/TaskFilter';
import { User } from '../../core/models/User';

@Component({
  selector: 'app-kanban-board-component',
  standalone: true,
  imports: [DragDropModule, CommonModule, MatSnackBarModule, TimeAgoPipe],
  templateUrl: './kanban-board-component.html',
  styleUrl: './kanban-board-component.css',
})
export class KanbanBoardComponent implements OnInit {
  // Loading indicator
  loading = true;

  // Kanban coloumns
  kanbanColumns: {
    status: TaskStatus;
    title: string;
    tasks: Task[];
  }[] = [
    { status: TaskStatus.TODO, title: 'To Do', tasks: [] },
    { status: TaskStatus.IN_PROGRESS, title: 'In Progress', tasks: [] },
    { status: TaskStatus.DONE, title: 'Done', tasks: [] },
  ];

  // filter and search
  filters: TaskFilter = {
    keyword: '',
    status: '',
    priority: '',
    assignedTo: '',
  };

  // Important: wrong sort field causes the http code 401
  sort: string = 'updatedAt,desc';
  page = 0;
  size = 100;

  assigneeList: User[] = [];

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private logger: LoggerService,
  ) {
    // set logger context
    this.logger.context = 'KanbanBoardComponent';
  }

  ngOnInit(): void {
    this.logger.log('ngOnInit(): void');
    this.loadTaks();
    this.loadAssigneeList();
  }

  loadAssigneeList() {
    this.logger.log('loadAssigneeList() called!');
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

  loadTaks() {
    this.logger.log('loadTaks() called!');
    // filtering and sorting at server side
    const params: any = {
      page: this.page,
      size: this.size,
      sort: this.sort,
      ...Object.fromEntries(
        Object.entries(this.filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''),
      ),
    };

    this.taskService.getTasks(params).subscribe({
      next: (res) => {
        this.mapTasksToColumns(res.content);
        this.loading = false;
        this.snackBar.open(`${res.content.length} / ${res.totalElements} Tasks loaded`, 'Close', {
          duration: 1000,
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.snackBar.open('Error: ' + err.toString(), 'Close', {
          duration: 2000,
        });
        this.cdr.detectChanges();
      },
    });
  }

  /**
   * map task list to kanban columns
   */
  mapTasksToColumns(tasks: Task[]) {
    this.kanbanColumns.forEach((col) => {
      col.tasks = tasks
        .filter((t) => t.status === col.status)
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    });
  }

  /* =======================
     DRAG & DROP
  ======================= */
  drop(event: CdkDragDrop<Task[]>, newStatus: TaskStatus) {
    this.logger.log('drop event called!');
    if (event.previousContainer === event.container) {
      // same column
      this.logger.log('same column');
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.logger.log('across columns');
      // move across columns
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const movedTask = event.container.data[event.currentIndex];
      movedTask.status = newStatus;

      this.updateTask(movedTask);
    }

    // update order after drag
    this.updatePositions(event.container.data);
  }

  updatePositions(tasks: Task[]) {
    tasks.forEach((task, index) => {
      task.position = index;
    });
  }

  /* =======================
     BACKEND SYNC
  ======================= */
  updateTask(task: Task) {
    this.taskService
      .getTask(task.id)
      .pipe(
        filter((value) => task.status !== value.status),
        switchMap((value) => this.taskService.updateTask(task.id, task)),
      )
      .subscribe({
        next: (updated) => {
           this.logger.log('Task updated', updated);
          // show snack bar
          this.snackBar.open(`Knanban board updated!`, 'Close', {
            duration: 2000,
          });
          this.updateTaskInColumns(<Task>updated);
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.logger.error('Update failed', err);
        },
      });
  }

  /* =======================
     HELPERS
  ======================= */
  trackByTaskId(index: number, task: Task) {
    return task.id;
  }

  getConnectedLists(): string[] {
    return this.kanbanColumns.map((c) => c.status);
  }

  /**
   * to update the kanaban board with new update obj
   * @param updatedTask
   * @returns
   */
  updateTaskInColumns(updatedTask: Task) {
    this.logger.log(updatedTask.id.toString());
    for (const col of this.kanbanColumns) {
      const index = col.tasks.findIndex((t) => t.id === updatedTask.id);
      this.logger.log('index=', index);
      if (index !== -1) {
        col.tasks[index] = updatedTask;
        return;
      }
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
