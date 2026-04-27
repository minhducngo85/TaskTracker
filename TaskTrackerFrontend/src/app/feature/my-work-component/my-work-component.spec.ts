import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWorkComponent } from './my-work-component';
import { provideRouter } from '@angular/router';

describe('MyWorkComponent', () => {
  let component: MyWorkComponent;
  let fixture: ComponentFixture<MyWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyWorkComponent],
      providers: [
        provideRouter([]), // 👈 thay RouterTestingModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyWorkComponent);
    component = fixture.componentInstance;
    // await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
