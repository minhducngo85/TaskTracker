import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../core/task-service';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-task-component',
  imports: [FormsModule, CommonModule],
  templateUrl: './task-component.html',
  styleUrl: './task-component.css',
})
export class TaskComponent {
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
  };

  // filter and search
  filterValue = '';
  searchValue = '';

  // task to be edited
  editingTask: any = null;

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
  ) {
    this.loadTasks();
  }

  loadTasks() {
    this.tasks$ = this.taskService.getTasks();
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  addTask(form: any) {
    if (form.invalid) return;

    this.taskService.addTask(this.newTask).subscribe({
      next: () => {
        this.toggleForm();
        this.newTask = { title: '', description: '', assignedTo: 'mngo', status: 'TODO' };
        this.loadTasks();
        form.resetForm();
      },
      error: (err: any) => console.error(err),
    });
  }

  deleteTask(id: number) {
    if (!confirm('Are you sure to delete this task?')) return;

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.loadTasks(); // 👈 assign trực tiếp
        this.cdr.detectChanges(); // trigger ui update
      },
      error: (err: any) => console.error(err),
    });
  }

  /**
   *
   */
  applyFilter() {
    this.tasks$ = this.taskService.getTasks().pipe(
      map((tasks) =>
        tasks.filter((t) => {
          return (
            (!this.filterValue || t.status === this.filterValue) &&
            (!this.searchValue || t.title.toLowerCase().includes(this.searchValue))
          );
        }),
      ),
    );
  }

  /** start edit */
  startEdit(task: any) {
    // clone task
    this.editingTask = {...task};
  }

  cancelEdit() {
    this.editingTask = null;
  }

  saveEdit() {
    this.taskService.updateTask(this.editingTask.id, this.editingTask).subscribe(
      {
        next : () => {
          this.editingTask = null;
          this.loadTasks();
          this.cdr.detectChanges(); // trigger ui update
        },
        error: (err : any) => console.error(err)
      }
    );
  }
}
