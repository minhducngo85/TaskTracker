import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTaskDialog } from './edit-task-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('EditTaskDialog', () => {
  let component: EditTaskDialog;
  let fixture: ComponentFixture<EditTaskDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTaskDialog],
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

    fixture = TestBed.createComponent(EditTaskDialog);
    component = fixture.componentInstance;
    // await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
