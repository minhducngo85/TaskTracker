import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityFeed } from './activity-feed';

import { RouterTestingModule } from '@angular/router/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('ActivityFeed', () => {
  let component: ActivityFeed;
  let fixture: ComponentFixture<ActivityFeed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityFeed],
      providers: [
        provideRouter([]), // 👈 thay RouterTestingModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityFeed);
    component = fixture.componentInstance;
    // await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render activity list', () => {
    component.activities = [
      {
        id: 1,
        message: 'Task created',
        taskTitle: 'Test Task',
        taskId: 1,
        createdAt: new Date().toDateString(),
        action: 'CREATED',
      },
    ];

    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('.activity-item'));
    expect(items.length).toBe(1);
  });

  it('should have correct href', () => {
    component.activities = [
      {
        id: 1,
        taskId: 5,
        taskTitle: 'Task A',
        message: '',
        createdAt: new Date().toISOString(),
        action: 'CREATED',
      },
    ];

    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a');

    expect(link.getAttribute('href')).toContain('/tasks/5');
  });

  it('should disable next button at last page', () => {
    component.activityPage = 2;
    component.totalActivityPages = 3;

    fixture.detectChanges();

    const btn = fixture.debugElement.queryAll(By.css('.page-btn'))[1].nativeElement;

    expect(btn.disabled).to.be.true;
  });

  it('should disable next button when reaching maxPageLimit', () => {
    component.activityPage = 20;
    component.totalActivityPages = 100;

    fixture.detectChanges();

    const btn = fixture.debugElement.queryAll(By.css('.page-btn'))[1].nativeElement;

    expect(btn.disabled).to.be.true;
  });

  it('should emit next event', () => {
    const spy = vi.spyOn(component.next, 'emit');

    component.nextPage();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit prev event', () => {
    const spy = vi.spyOn(component.prev, 'emit');

    component.prevPage();

    expect(spy).toHaveBeenCalled();
  });

  it('should show empty message', () => {
    component.activities = [];

    fixture.detectChanges();

    const el = fixture.nativeElement;
    expect(el.textContent).toContain('No activity');
  });

  it('should return correct icon', () => {
    expect(component.getActivityIcon('CREATED')).toBe('open_in_new');
  });
});
