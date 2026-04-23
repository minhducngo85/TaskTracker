import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TimeAgoPipe } from '../../core/pipe/TimeAgoPipe';
import { TaskService } from '../../core/services/task-service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from '../../core/services/logger-service';
import { Task } from '../../core/models/Task';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { EditTaskDialog } from '../edit-task-dialog/edit-task-dialog';
import { User } from '../../core/models/User';
import { Location } from '@angular/common';
import { debounceTime, Subject } from 'rxjs';
import { TaskComment } from '../../core/models/TaskComment';
import { QuillModule } from 'ngx-quill';
import { TaskHistory } from '../../core/models/TaskHistory';
import { MatTabsModule } from '@angular/material/tabs';

/**
 * @author Minh Duc Ngo
 */
@Component({
  standalone: true,
  selector: 'app-task-detail',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    QuillModule,
    MatTabsModule,
    TimeAgoPipe
],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetail implements OnInit {
  // the selected task
  task?: Task;

  assigneeList: User[] = [];

  // loading indicator
  loading = true;

  // comments
  comments: TaskComment[] = [];
  // comments: paginator
  page = 0;
  size = 10;
  totalPages = 0;


  

  newComment = '';
  commentLoading = false;

  quillConfig = {
    toolbar: [
      ['bold', 'italic'],
      ['code-block'],
      ['emoji'], // cần plugin nếu muốn thật
      ['link'],
    ],
  };

  // history
  history: TaskHistory[] = [];
  historyPage = 0;
  totalHistoryPages = 0;

  // the selected task id
  taskId!: Number;

  /** History or comment */
  selectedTabIndex = 0;

  /**
   * inject DJ in constructor
   *
   * @param taskService
   * @param cdr
   * @param route
   * @param router
   * @param logger
   * @param snackBar
   * @param dialog
   * @param location
   */
  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private logger: LoggerService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private location: Location,
  ) {
    this.logger.context = 'TaskDetail';
  }

  ngOnInit(): void {
    this.logger.log('ngOnInit(): void called!');
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));

    // get current active tab
    const savedIndex = sessionStorage.getItem('taskDetailActiveTab');
    if (savedIndex !== null) {
      this.selectedTabIndex = +savedIndex;
    }

    // load data form backend
    this.loadTaskDetail();
    this.loadAssigneeList();
    this.loadComments();
    this.loadHistory();

    // init debounce for save tag
    this.saveTags$.pipe(debounceTime(2000)).subscribe(() => {
      if (!this.task) return;

      this.taskService.updateTask(this.task.id, this.task).subscribe({
        next: (res) => {
          this.task = res;
          this.snackBar.open(`Tags updated!`, 'Close', {
            duration: 2000,
          });
        },
        error: (err) => console.error(err),
      });
    });
  }

  loadHistory() {
    this.logger.info('loadHistory() called.');
    this.taskService.getHistory(this.taskId, this.historyPage, this.size).subscribe((res) => {
      this.history = res.content;
      this.totalHistoryPages = res.totalPages;
      this.logger.info(JSON.stringify(this.history));
      this.cdr.detectChanges();
    });
  }

  /**
   * laod task comments
   */
  loadComments() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.logger.info('loadComment() called.');
    this.taskService.getComments(id, this.page, this.size).subscribe((res) => {
      this.comments = res.content;
      this.totalPages = res.totalPages;
      this.logger.info(JSON.stringify(this.comments));
      this.cdr.detectChanges();
    });
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadComments();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.loadComments();
    }
  }

  
  nextHistoryPage() {
    if (this.historyPage < this.totalHistoryPages - 1) {
      this.historyPage++;
      this.loadHistory();
    }
  }

  prevHistoryPage() {
    if (this.historyPage > 0) {
      this.historyPage--;
      this.loadHistory();
    }
  }

  /**
   * to load assignee list
   */
  loadAssigneeList() {
    this.logger.info('loadAssigneeList() called.');
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

  /**
   * load task detail form backend
   */
  loadTaskDetail() {
    this.logger.log('loadTaskDetail() called!');
    this.loading = true;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.taskService.getTask(id).subscribe({
        next: (res) => {
          this.task = res;
          this.loading = false;
          this.snackBar.open(`Task detail loaded!`, 'Close', {
            duration: 1000,
          });
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.logger.error('Error to get assignee list', err);
          this.snackBar.open(`Error to get assignee list`, 'Close', {
            duration: 1000,
          });
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
    }
  }

  openEditDialog() {
    if (!this.task) return;

    const dialogRef = this.dialog.open(EditTaskDialog, {
      width: '500px',
      maxWidth: '95vw',
      data: {
        task: this.task,
        assignees: this.assigneeList,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskService.updateTask(result.id, result).subscribe((updated) => {
          this.task = updated; // update UI ngay
          this.loadHistory();
          this.snackBar.open('Task updated', 'OK', { duration: 2000 });
          this.cdr.detectChanges();
        });
      } else {
        // 👉 CANCEL
        console.log('Edit cancelled');
      }
    });
  }

  /** to delete the selected task */
  deleteTask() {
    if (!this.task) return;

    const confirmDelete = confirm('Are you sure you want to delete this task?');

    if (!confirmDelete) return;

    this.taskService.deleteTask(this.task.id).subscribe(() => {
      this.snackBar.open('Task deleted', 'OK', { duration: 2000 });
      this.router.navigate(['/tasks']);
    });
  }

  /**  */
  goBack() {
    // this.router.navigate(['../'], { relativeTo: this.route });
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/tasks']); // fallback
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

  // Edit tag
  editingTags = false;
  tagInput = '';

  startEditTags() {
    this.editingTags = true;
  }

  addTag() {
    if (!this.task) return;

    const value = this.tagInput.trim();
    if (!value) return;

    this.task.tags = this.task.tags || [];

    if (!this.task.tags.includes(value)) {
      this.task.tags.push(value);
    }

    this.tagInput = '';
  }

  private saveTags$ = new Subject<void>();

  removeTag(tag: string) {
    if (!this.task) return;
    // update ui
    this.task.tags = this.task.tags.filter((t) => t !== tag);
    // trigger debounce
    this.saveTags$.next();
  }

  onBackspace() {
    if (!this.task) return;
    if (!this.tagInput && this.task.tags?.length) {
      this.task.tags.pop();
    }
  }

  stopEditTags() {
    this.editingTags = false;
    if (!this.task) return;
    this.taskService.updateTask(this.task.id, this.task).subscribe(() =>
      this.snackBar.open(`Tags updated!`, 'Close', {
        duration: 2000,
      }),
    );
  }

  addComment() {
    if (!this.newComment || this.newComment === '<p><br></p>') return;

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.commentLoading = true;

    this.taskService.addComment(id, this.newComment).subscribe({
      next: () => {
        this.page = 0;
        this.newComment = ''; // clear editor
        this.loadComments(); // 🔥 reload comments
      },
      complete: () => (this.commentLoading = false),
      error: () => (this.commentLoading = false),
    });
  }

  onTabChange(event: any) {
    console.log('Selected tab index:', event.index);
    const index = event.index;
    sessionStorage.setItem('taskDetailActiveTab', index.toString());
  }
}
