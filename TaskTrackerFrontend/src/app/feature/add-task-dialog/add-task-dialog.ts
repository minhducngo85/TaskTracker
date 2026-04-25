import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TaskPriority } from '../../core/models/TaskPriority';
import { TaskStatus } from '../../core/models/TaskStatus';
import { Authentication } from '../../core/services/authentication';
import { User } from '../../core/models/User';
import { TaskService } from '../../core/services/task-service';
import { MatDatepickerModule } from '@angular/material/datepicker';

// auto comple
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-add-task-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
  ],
  templateUrl: './add-task-dialog.html',
  styleUrl: './add-task-dialog.css',
})
export class AddTaskDialog implements OnInit {
  taskForm: FormGroup;

  assigneeList: User[] = [];

  // Priority Options
  priorityOptions = Object.values(TaskPriority);

  // Priority Options
  statusOptions = Object.values(TaskStatus);

  // tags autocomplete
  tagCtrl!: FormControl;
  allTags: string[] = [];
  filteredTags$!: Observable<string[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      assignees: User[];
    },
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTaskDialog>,
    private auth: Authentication,
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
  ) {
    this.assigneeList = data.assignees;

    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [''],
      priority: [TaskPriority.LOW],
      assignedTo: [auth.getUsername, Validators.required],
      tags: [[]],
    });
  }

  ngOnInit() {
    this.tagCtrl = this.fb.control('');
    this.loadTags();

    // ✅ reactive autocomplete
    this.filteredTags$ = this.tagCtrl.valueChanges.pipe(
      startWith(''), // emit one value after compoenent load
      map((value) => this._filter(value || '')),
    );
  }

  // read all tags from backend
  loadTags() {
    this.taskService.getAllTags().subscribe((tags) => {
      this.allTags = tags;
    });
  }

  // submit form
  submit() {
    if (this.taskForm.valid) {
      this.dialogRef.close(this.taskForm.value);
    }
  }

  // cancel form
  cancel() {
    this.dialogRef.close();
  }

  // 👉 getter cho gọn
  get tags(): string[] {
    return this.taskForm.get('tags')?.value || [];
  }

  // filter tags for auto complete
  private _filter(value: string): string[] {
    const v = value.toLowerCase();
    return this.allTags.filter((tag) => tag.toLowerCase().includes(v) && !this.tags.includes(tag));
  }

  // auto complete
  addTagFromInput() {
    const value = this.tagCtrl.value?.trim();
    if (!value) return;

    if (!this.tags.includes(value)) {
      this.taskForm.patchValue({
        tags: [...this.tags, value],
      });
    }

    this.tagCtrl.setValue('');
  }

  // auto complete
  selectTag(tag: string) {
    if (!this.tags.includes(tag)) {
      this.taskForm.patchValue({
        tags: [...this.tags, tag],
      });
    }

    this.tagCtrl.setValue('');
  }

  // auto complete
  removeTag(tag: string) {
    this.taskForm.patchValue({
      tags: this.tags.filter((t) => t !== tag),
    });
  }
}
