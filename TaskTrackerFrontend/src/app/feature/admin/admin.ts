import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user-service';
import { CommonModule } from '@angular/common';
import { User } from '../../core/models/User';


@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  users: User[] = [];
  error: string | null = null;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loadUsers();
    }, 0);
  }

  loadUsers() {
    this.error = null;
    this.userService.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(err);
        this.error = err;
      },
    });
  }
}
