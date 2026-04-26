import { Component, Inject } from '@angular/core';
import { Task } from '../../../core/models/Task';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TaskPriority } from '../../../core/models/TaskPriority';
import { TaskStatus } from '../../../core/models/TaskStatus';
import { User } from '../../../core/models/User';

@Component({
  selector: 'app-edit-task-dialog',
  imports: [
    CommonModule,
    FormsModule,

    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './edit-task-dialog.html',
  styleUrl: './edit-task-dialog.css',
})
export class EditTaskDialog {
  task: Task;
  assigneeList: User[] = [];

  // Priority Options
  priorityOptions = Object.values(TaskPriority);

  // Priority Options
  statusOptions = Object.values(TaskStatus);

  constructor(
    public dialogRef: MatDialogRef<EditTaskDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      task: Task;
      assignees: User[];
    },
  ) {
    // clone to avoid altering data from roiginal
    this.task = { ...data.task };
    this.assigneeList = data.assignees;

    console.log('assigneeList length:', this.assigneeList?.length);

    this.assigneeList?.forEach((u, i) => {
      console.log(`User ${i}:`, u);
    });
  }

  save() {
    this.dialogRef.close(this.task);
  }

  close() {
    this.dialogRef.close();
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
        return '⚫️';
    }
  }
}
