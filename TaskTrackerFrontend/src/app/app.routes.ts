import { Routes } from '@angular/router';
import { Login } from './feature/auth/login/login';
import { TaskComponent } from './feature/task-component/task-component';
import { authGuard } from './core/services/auth-guard';
import { adminGuard } from './core/services/admin-guard';
import { Admin } from './feature/admin/admin';
import { DashboardComponent } from './feature/dashboard-component/dashboard-component';
import { KanbanBoardComponent } from './feature/kanban-board-component/kanban-board-component';
import { TaskDetail } from './feature/task-detail/task-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'kanbanboard', component: KanbanBoardComponent, canActivate: [authGuard] },
  { path: 'tasks', component: TaskComponent, canActivate: [authGuard] },
  { path: 'tasks/:id', component: TaskDetail, canActivate: [authGuard] },
  { path: 'admin', component: Admin, canActivate: [adminGuard] },

  { path: '**', redirectTo: 'dashboard' },
];
