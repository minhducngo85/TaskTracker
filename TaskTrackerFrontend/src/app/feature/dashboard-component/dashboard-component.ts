import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../core/services/task-service';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { TaskStatus } from '../../core/models/TaskStatus';
import { TaskPriority } from '../../core/models/TaskPriority';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TimeAgoPipe } from '../../core/pipe/TimeAgoPipe';
import { Task } from '../../core/models/Task';
import { TaskFilter } from '../../core/models/TaskFilter';
import { LoggerService } from '../../core/services/logger-service';
import { User } from '../../core/models/User';
import { Authentication } from '../../core/services/authentication';
import { TagCount } from '../../core/models/TagCount';
import { MyWork } from '../../core/models/MyWork';

Chart.register(ChartDataLabels);

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;

  critical: number;
  high: number;
  medium: number;
  low: number;

  completionPercent: number;
}

@Component({
  selector: 'app-dashboard-component',
  imports: [CommonModule, FormsModule, TimeAgoPipe],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent implements OnInit, AfterViewInit {
  // Loading indicator
  loading = true;

  // Observable instead array
  tasks$!: Observable<Task[]>;

  total: number = 0;

  recentTasks$!: Observable<Task[]>;
  myTasks$!: Observable<Task[]>;

  // Statistics
  stats$!: Observable<TaskStats>;

  assigneeList: User[] = [];

  // Priority chart
  private chartCanvas!: ElementRef<HTMLCanvasElement>;

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
  size = 6;

  @ViewChild('chartCanvas')
  set chartCanvasSetter(canvas: ElementRef<HTMLCanvasElement>) {
    if (!canvas) return;

    this.chartCanvas = canvas;

    // Khi canvas xuất hiện → create chart
    this.initChart();
  }

  // top tags
  topTags: TagCount[] = [];

  // my works
  myWork: MyWork = {
    overdue: 0,
    today: 0,
    thisWeek: 0,
  };

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private snackBar: MatSnackBar,
    private logger: LoggerService,
    private auth: Authentication,
  ) {
    this.logger.context = 'DashboardComponent';
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.logger.log('ngOnInit(): void');
    this.loadRecentTasks();
    this.loadAssigneeList();
    this.loadMyTasks();
    this.loadTopTags();
    this.loadMyWork();
  }

  loadMyWork() {
    this.taskService.getMyWork().subscribe((res) => {
      this.myWork = res;
      this.logger.info('My Work: ' + JSON.stringify(this.myWork));
    });
  }

  loadTopTags() {
    this.logger.log('loadTopTags() called!');
    this.taskService.getTopTags().subscribe((tags) => {
      this.topTags = tags;
      this.logger.info(JSON.stringify(this.topTags));
    });
  }

  /** Load the assignee list form backend */
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

  loadMyTasks() {
    this.logger.log(`loadMyTasks() called! Username=${this.auth.getUsername()}`);

    const myTasksFilters: TaskFilter = {
      keyword: '',
      status: '',
      priority: '',
      assignedTo: this.auth.getUsername() || '',
    };

    // filtering and sorting at server side
    const params: any = {
      page: this.page,
      size: 5,
      sort: this.sort,
      ...Object.fromEntries(
        Object.entries(myTasksFilters).filter(
          ([_, v]) => v !== null && v !== undefined && v !== '',
        ),
      ),
    };

    this.myTasks$ = this.taskService.getTasks(params).pipe(
      tap((res) => {
        this.total = res.totalElements;
        this.logger.info(`My tasks: ${this.total}`);
      }),
      map((res) => res.content),
      tap({
        error: (err) => {
          this.logger.error('ERROR STATUS:', err);
          this.snackBar.open(`Error to get task list`, 'Close', {
            duration: 1000,
          });
          this.cdr.detectChanges();
        },
      }),
      shareReplay(1),
    );
  }

  /**
   * loads tasks from backend and calcualte stats
   */
  loadRecentTasks() {
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

    this.recentTasks$ = this.taskService.getTasks(params).pipe(
      tap((res) => {
        this.total = res.totalElements;
      }),
      map((res) => res.content),
      tap({
        error: (err) => {
          this.logger.error('ERROR STATUS:', err);
          this.snackBar.open(`Error to get task list`, 'Close', {
            duration: 1000,
          });
          this.cdr.detectChanges();
        },
      }),
      shareReplay(1),
    );

    this.stats$ = this.taskService.getStats().pipe(
      tap({
        next: () => {
          this.loading = false;
          this.cdr.detectChanges();
          this.logger.info(`Loading done!`);
        },
        error: (err) => {
          this.logger.error('ERROR STATUS:', err);
          this.snackBar.open(`Error: ${err.message}`, 'Close', {
            duration: 3000,
          });
          this.cdr.detectChanges();
        },
      }),
      map((stats) => ({
        ...stats,
        completionPercent: stats.total ? Math.round((stats.done / stats.total) * 100) : 0,
      })),

      shareReplay(1), // cache result
    );
  }

  /**
   * chart creation
   */
  chart!: Chart;
  initChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Critical', 'High', 'Medium', 'Low'],
        datasets: [
          {
            data: [0, 0, 0, 0],
            backgroundColor: ['#f80004', '#da680b', '#facc15', '#22c55e'],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: 'bottom',
          },
          datalabels: {
            color: '#fff',
            font: {
              weight: 'bold',
              size: 12,
            },
            formatter: (value, context) => {
              const data = context.chart.data.datasets[0].data as number[];
              const total = data.reduce((a, b) => a + b, 0);
              const percent = total ? ((value / total) * 100).toFixed(0) : 0;
              const label = context.chart.data.labels?.[context.dataIndex];
              return `${value} (${percent}%)`;
            },
          },
        },
      },
    });

    // subscribe ở đây luôn
    this.stats$.subscribe((stats) => {
      this.chart.data.datasets[0].data = [stats.critical, stats.high, stats.medium, stats.low];
      this.chart.update();
    });
  }

  onChartClick(event: any) {
    const points = this.chart.getElementsAtEventForMode(
      event,
      'nearest',
      { intersect: true },
      true,
    );

    if (points.length) {
      const index = points[0].index;
      const label = this.chart.data.labels?.[index];
      this.logger.log('Chart clicked: ' + label);
      this.router.navigate(['/tasks'], {
        queryParams: { priority: label },
        queryParamsHandling: 'merge',
      });
    }
  }

  /**
   * to show task by status
   *
   * @param status
   */
  filterStatus(status: string) {
    this.router.navigate(['/tasks'], {
      queryParams: { status: status },
    });
  }

  /**
   *
   * @param status show my tasks
   */
  toMyWork() {
    this.router.navigate(['/my-work']);
  }

  /**
   *
   * @param status show all task sorting by updatedAt
   */
  sortTaksByUpdated() {
    this.router.navigate(['/tasks'], {
      queryParams: { sort: 'updatedAt,desc' },
    });
  }

  /**
   *
   * @param status show all task sorting by updatedAt
   */
  goToDetail(id: number) {
    this.router.navigate(['/tasks', id]);
  }

  filterByTag(tag: string) {
    this.router.navigate(['/tasks'], {
      queryParams: { tag },
    });
  }

  progressColorClass(percent: number): string {
    if (percent < 50) return 'progress-medium';
    //if (percent < 70) return 'progress-medium';
    return 'progress-high';
  }

  toKanbanBoard() {
    this.router.navigate(['/kanbanboard']);
  }

  calculatePercentage(value: number, total: number) {
    return total ? ((value / total) * 100).toFixed(0) : 0;
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
