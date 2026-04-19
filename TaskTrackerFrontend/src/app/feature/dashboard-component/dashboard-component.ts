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
import { map, Observable, shareReplay } from 'rxjs';
import { TaskStatus } from '../../core/models/TaskStatus';
import { TaskPriority } from '../../core/models/TaskPriority';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Router } from '@angular/router';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent implements OnInit, AfterViewInit {
  // Observable instead array
  tasks$!: Observable<any[]>;

  recentTasks$!: Observable<any[]>;

  // Statistics
  stats$!: Observable<TaskStats>;

  // Priority chart
  private chartCanvas!: ElementRef<HTMLCanvasElement>;

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
  ) {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.loadTasks();
  }

  /**
   * loas tasks from backend and calcualte stats
   */
  loadTasks() {
    this.tasks$ = this.taskService.getTasks();
    this.recentTasks$ = this.tasks$.pipe(
      map((tasks) =>
        tasks
          .slice()
          .sort((a, b) => b.id - a.id)
          .slice(0, 8),
      ),
    );
    this.stats$ = this.tasks$.pipe(
      map((tasks) => {
        const total = tasks.length;
        const done = tasks.filter((t) => t.status === TaskStatus.DONE).length;

        return {
          total: tasks.length,
          todo: tasks.filter((t) => t.status === TaskStatus.TODO).length,
          inProgress: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
          done: tasks.filter((t) => t.status === TaskStatus.DONE).length,

          critical: tasks.filter((t) => t.priority === TaskPriority.CRITICAL).length,
          high: tasks.filter((t) => t.priority === TaskPriority.HIGH).length,
          medium: tasks.filter((t) => t.priority === TaskPriority.MEDIUM).length,
          low: tasks.filter((t) => t.priority === TaskPriority.LOW).length,
          completionPercent: total ? Math.round((done / total) * 100) : 0,
        };
      }),
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
      console.log('Chart clicked: ' + label);
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
}
