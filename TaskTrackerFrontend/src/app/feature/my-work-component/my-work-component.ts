import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MyWorkGroup } from '../../core/models/MyWorkGroup';
import { TaskService } from '../../core/services/task-service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from '../../core/services/logger-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeAgoPipe } from '../../core/pipe/TimeAgoPipe';
import { Task } from '../../core/models/Task';
import { isTaskOverdue, isTodayTask } from '../../app/app-utils';

@Component({
  selector: 'app-my-work-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './my-work-component.html',
  styleUrl: './my-work-component.css',
})
export class MyWorkComponent implements OnInit {
  myWork$!: Observable<MyWorkGroup>;

  // expose the util functions
  isTaskOverdue = isTaskOverdue;
  isTodayTask = isTodayTask;

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private logger: LoggerService,
    private snackBar: MatSnackBar,
  ) {
    this.logger.context = 'MyWorkComponent';
  }

  ngOnInit(): void {
    this.loadMyActiveTasks();
  }

  loadMyActiveTasks() {
    this.myWork$ = this.taskService.getMyActiveTasks().pipe(
      map((tasks) => {
        return {
          overdue: this.sortByDueDateAsc(tasks.filter((t) => this.isTaskOverdue(t))),
          inProgress: this.sortByDueDateAsc(
            tasks.filter((t) => t.status === 'IN_PROGRESS' && !this.isTaskOverdue(t)),
          ),
          todo: this.sortByDueDateAsc(
            tasks.filter((t) => t.status === 'TODO' && !this.isTaskOverdue(t)),
          ),
          total: tasks.length,
        };
      }),
    );
  }

  private sortByDueDateAsc(tasks: any[]) {
    return [...tasks].sort((a, b) => {
      const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return da - db;
    });
  }

  trackById(index: number, item: Task) {
    return item.id;
  }

  goToDetail(id: number) {
    this.router.navigate(['/tasks', id]);
  }
}
