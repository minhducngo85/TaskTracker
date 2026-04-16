import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('TaskTrackerFrontend');
  constructor(private router: Router) {}
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
