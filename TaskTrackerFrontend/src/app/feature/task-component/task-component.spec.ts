import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskComponent } from './task-component';
import { provideRouter } from '@angular/router';

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskComponent],
      providers: [
        provideRouter([]), // 👈 thay RouterTestingModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;
    // await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
