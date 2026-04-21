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
  // Observable instead array
  tasks$!: Observable<Task[]>;

  total: number = 0;

  recentTasks$!: Observable<Task[]>;

  // Statistics
  stats$!: Observable<TaskStats>;

  // Priority chart
  private chartCanvas!: ElementRef<HTMLCanvasElement>;

  // filter and search
  filters: TaskFilter = {
    title: '',
    status: '',
    priority: '',
    assignedTo: '',
  };

  // Important: wrong sort field causes the http code 401
  sort: string = 'updatedAt,desc';
  page = 0;
  size = 8;

  @ViewChild('chartCanvas')
  set chartCanvasSetter(canvas: ElementRef<HTMLCanvasElement>) {
    if (!canvas) return;

    this.chartCanvas = canvas;

    // Khi canvas xuất hiện → create chart
    this.initChart();
  }

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private snackBar: MatSnackBar,
    private logger : LoggerService
  ) {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.logger.context = 'DashboardComponent';
    this.loadTasks();
  }

  /**
   * loas tasks from backend and calcualte stats
   */
  loadTasks() {
    this.logger.log("loadTaks() called!");
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
        },
      }),
      shareReplay(1),
    );

    this.stats$ = this.taskService.getStats().pipe(
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
              const label = context.chart.data.labels?.[context.dataIndex];
              return `${label}: ${value}`;
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

  progressColorClass(percent: number): string {
    if (percent < 50) return 'progress-medium';
    //if (percent < 70) return 'progress-medium';
    return 'progress-high';
  }

  toKanbanBoard() {
    this.router.navigate(['/kanbanboard']);
  }
}
