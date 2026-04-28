import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard-component';
import { TaskService } from '../../core/services/task-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoggerService } from '../../core/services/logger-service';
import { Authentication } from '../../core/services/authentication';
import { ActivityService } from '../../core/services/activity-service';
import { defer, firstValueFrom, mergeMap, NEVER, of, throwError } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  // Mocking services
  let taskServiceMock: any;
  let routerMock: any;
  let snackBarMock: any;
  let activityServiceMock: any;
  let loggerMock: any;

  beforeEach(async () => {
    taskServiceMock = {
      getTasks: vi.fn(),
      getStats: vi.fn(),
      getTopTags: vi.fn(),
      getMyWork: vi.fn(),
      getAssigneeList: vi.fn(),
      getCompleteTasks: vi.fn(),
    };

    loggerMock = {
      log: vi.fn(),
      info: vi.fn(),
      error: vi.fn(),
    };

    activityServiceMock = {
      getActivites: vi.fn(),
    };

    routerMock = {
      navigate: vi.fn(),
    };

    snackBarMock = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: LoggerService, useValue: loggerMock },
        { provide: Authentication, useValue: { getUsername: () => 'testUser' } },
        { provide: ActivityService, useValue: activityServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    // await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const mockStats = {
    total: 10,
    todo: 3,
    inProgress: 2,
    done: 5,

    critical: 1,
    high: 2,
    medium: 3,
    low: 4,
  };

  const myWorkMock = {
    overdue: 1,
    today: 3,
    thisWeek: 5,
  };

  const emptyTasks = { content: [], totalElements: 0 };
  const emptyActivities = { content: [], totalElements: 0 };
  const topTagsMock = [
    { tag: 'Angular', count: 3 },
    { tag: 'Java', count: 2 },
  ];

  function mockAllServices() {
    taskServiceMock.getTasks.mockReturnValue(of(emptyTasks));
    taskServiceMock.getStats.mockReturnValue(of(mockStats));
    activityServiceMock.getActivites.mockReturnValue(of(emptyActivities));
    taskServiceMock.getAssigneeList.mockReturnValue(of([]));
    taskServiceMock.getTopTags.mockReturnValue(of(topTagsMock));
    taskServiceMock.getMyWork.mockReturnValue(of(myWorkMock));
  }
  // Life cycle
  it('should call load methods on init', () => {
    mockAllServices();

    component.ngOnInit();

    expect(taskServiceMock.getTasks).toHaveBeenCalled();
    expect(taskServiceMock.getStats).toHaveBeenCalled();
    expect(taskServiceMock.getMyWork).toHaveBeenCalled();
  });

  // stats observable
  it('should load stats and calculate completionPercent', async () => {
    // When
    taskServiceMock.getTasks.mockReturnValue(of({ content: [], totalElements: 0 }));
    taskServiceMock.getStats.mockReturnValue(of(mockStats));

    // Action
    component.loadRecentTasksAndStats();

    // Verify
    const result = await firstValueFrom(component.stats$);
    expect(result?.completionPercent).toBe(50);
    expect(component.loading).toBe(false);
    expect(loggerMock.log).toHaveBeenCalled();
  });

  //  navigation
  it('should navigate to tasks with status', () => {
    component.filterStatus('TODO');

    expect(routerMock.navigate).toHaveBeenCalledWith(['/tasks'], {
      queryParams: { status: 'TODO' },
    });
  });

  it('should navigate to my work', () => {
    component.toMyWork();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/my-work']);
  });

  it('should navigate to kanban board', () => {
    component.toKanbanBoard();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/kanbanboard']);
  });

  //  helper functions
  it('should calculate percentage correctly', () => {
    expect(component.calculatePercentage(5, 10)).toBe('50');
  });

  it('should return 0 when total is 0', () => {
    expect(component.calculatePercentage(5, 0)).toBe(0);
  });

  it('should return correct progress class', () => {
    expect(component.progressColorClass(30)).toBe('progress-medium');
    expect(component.progressColorClass(80)).toBe('progress-high');
  });

  //  assignee
  it('should return fullname if exists', () => {
    component.assigneeList = [{ username: 'test', fullname: 'Test User' } as any];

    expect(component.assigneeFullname('test')).toBe('Test User');
  });

  it('should fallback to username', () => {
    component.assigneeList = [];

    expect(component.assigneeFullname('abc')).toBe('abc');
  });

  //  activities
  it('should load activities', () => {
    activityServiceMock.getActivites.mockReturnValue(of({ content: [{ id: 1 }], totalPages: 2 }));

    component.loadActivities();

    expect(component.activities.length).toBe(1);
    expect(component.totalActivityPages).toBe(2);
  });

  // ✅ pagination
  it('should go to next activity page', () => {
    component.activityPage = 0;
    component.totalActivityPages = 2;

    activityServiceMock.getActivites.mockReturnValue(of({ content: [], totalPages: 2 }));
    const spy = vi.spyOn(component, 'loadActivities');

    component.nextActivityPage();

    expect(component.activityPage).toBe(1);
    expect(spy).toHaveBeenCalled();
  });

  it('should not exceed last page', () => {
    component.activityPage = 1;
    component.totalActivityPages = 2;

    activityServiceMock.getActivites.mockReturnValue(of({ content: [], totalPages: 2 }));
    const spy = vi.spyOn(component, 'loadActivities');

    component.nextActivityPage();

    expect(component.activityPage).toBe(1);
    expect(spy).not.toHaveBeenCalled();
  });

  // ############# UI tests

  it('should render dashboard title', async () => {
    mockAllServices();

    fixture.detectChanges();
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.title')?.textContent).toContain('Dashboard');
  });

  it('should render sattistics', async () => {
    mockAllServices();

    fixture.detectChanges();
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('10'); // total
    expect(el.textContent).toContain('3'); // todo
    expect(el.textContent).toContain('5'); // done
  });

  it('should navigate when clicking TODO card', async () => {
    mockAllServices();

    fixture.detectChanges();
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;

    const todoCard = el.querySelector('.card.todo') as HTMLElement;
    todoCard.click();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/tasks'], {
      queryParams: { status: 'TODO' },
    });
  });

  it('should render progress bar', async () => {
    mockAllServices();

    fixture.detectChanges();
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;

    // HTML check
    const progressBar = el.querySelector('.progress-fill') as HTMLElement;
    expect(progressBar.style.width).toContain('50');

    // click check
    const progressCard = el.querySelector('.section-progress') as HTMLElement;
    progressCard.click();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/kanbanboard']);
  });

  it('should render top tags', async () => {
    mockAllServices();
    fixture.detectChanges();
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const tags = el.querySelectorAll('.tag-item');
    expect(tags.length).toBe(2);
  });

  it('should show loading indicator', () => {
    taskServiceMock.getTasks.mockReturnValue(of({ content: [], totalElements: 0 }));

    // 👇 QUAN TRỌNG: không emit → không set loading = false
    taskServiceMock.getStats.mockReturnValue(NEVER);

    activityServiceMock.getActivites.mockReturnValue(of({ content: [], totalPages: 0 }));
    taskServiceMock.getTopTags.mockReturnValue(of([]));
    taskServiceMock.getMyWork.mockReturnValue(of({ overdue: 0, today: 0, thisWeek: 0 }));
    taskServiceMock.getAssigneeList.mockReturnValue(of([]));

    component.loading = true;

    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.loading')).toBeTruthy();
  });
});
