import { Routes } from '@angular/router';
import { Login } from './feature/auth/login/login';
import { TaskComponent } from './feature/task-component/task-component';
import { authGuard } from './core/auth-guard';


export const routes: Routes = [
    { path: '', redirectTo: 'tasks', pathMatch: 'full' },

  { path: 'login', component: Login},

  { path: 'tasks', component: TaskComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: 'tasks' }
];
