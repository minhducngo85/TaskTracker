import { Routes } from '@angular/router';
import { Login } from './feature/auth/login/login';
import { TaskComponent } from './feature/task-component/task-component';
import { authGuard } from './core/auth-guard';
import { adminGuard } from './core/admin-guard';
import { Admin } from './ferature/admin/admin';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'tasks', component: TaskComponent, canActivate: [authGuard] },
  { path: 'admin', component: Admin, canActivate: [adminGuard] },

  { path: '**', redirectTo: 'tasks' },
];
