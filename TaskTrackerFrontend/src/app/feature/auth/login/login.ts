import { Component } from '@angular/core';
import { Authentication } from '../../../core/services/authentication';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = 'admin';
  password = 'abcd1234';
  error='';

  constructor(private authService : Authentication, private router: Router){};

  login() {
    this.authService.login(
      {
        username : this.username,
        password : this.password
      }
    ).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.error = 'Login failed'
    });
  }
}
