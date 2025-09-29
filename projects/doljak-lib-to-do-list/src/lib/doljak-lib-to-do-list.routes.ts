import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuard } from './config/guard/auth.guard';
import { roleGuard } from './config/guard/role.guard';

export const PATHS = {
  login: 'login',
  cms: 'cms',
  todoList: 'todo-list'
};

export const libRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: PATHS.login
  },
  {
    path: PATHS.login,
    loadComponent: () => 
      import('./pages/login/login.component').then(m => m.LoginComponent),
    
  },
  {
    path: PATHS.cms,
    loadComponent: () => 
      import('./pages/cms/cms.component').then(m => m.CmsComponent),
    canActivate: [authGuard , roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: PATHS.todoList,
    loadComponent: () => 
      import('./pages/todo-list/todo-list.component').then(m => m.TodoListComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];