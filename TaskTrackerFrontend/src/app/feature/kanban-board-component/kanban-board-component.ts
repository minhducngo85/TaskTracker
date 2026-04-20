import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TaskService } from '../../core/services/task-service';
import { Task } from '../../core/models/Task';
import { TaskStatus } from '../../core/models/TaskStatus';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from "../../core/pipe/TimeAgoPipe";

@Component({
  selector: 'app-kanban-board-component',
  standalone: true,
  imports: [DragDropModule, CommonModule, MatSnackBarModule, TimeAgoPipe],
  templateUrl: './kanban-board-component.html',
  styleUrl: './kanban-board-component.css',
})
export class KanbanBoardComponent implements OnInit {
  loading = true;

  kanbanColumns: {
    status: TaskStatus;
    title: string;
    tasks: Task[];
  }[] = [
    { status: TaskStatus.TODO, title: 'To Do', tasks: [] },
    { status: TaskStatus.IN_PROGRESS, title: 'In Progress', tasks: [] },
    { status: TaskStatus.DONE, title: 'Done', tasks: [] },
  ];

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadTaks();
  }

  loadTaks() {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.mapTasksToColumns(tasks);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.snackBar.open('Error: ' + err, 'Close', {
          duration: 2000,
        });
      },
    });
  }

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

    if (event.previousContainer === event.container) {
      // same column
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // move across columns
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
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
      this.updateTask(task, false);
    });
  }

  /* =======================
     BACKEND SYNC
  ======================= */
  updateTask(task: Task, showLog: boolean = true) {
    this.taskService.updateTask(task.id, task).subscribe({
      next: () => {
        if (showLog) console.log('Task updated', task);
      },
      error: err => {
        console.error('Update failed', err);
      }
    });
  }

  /* =======================
     HELPERS
  ======================= */
  trackByTaskId(index: number, task: Task) {
    return task.id;
  }

  getConnectedLists(): string[] {
    return this.kanbanColumns.map(c => c.status);
  }
}
