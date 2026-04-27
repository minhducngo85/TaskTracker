import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskDialog } from './add-task-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('AddTaskDialog', () => {
  let component: AddTaskDialog;
  let fixture: ComponentFixture<AddTaskDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTaskDialog],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: vi.fn(), // 👈 mock function
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}, // 👈transfer data into dialog
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTaskDialog);
    component = fixture.componentInstance;
    // await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
