import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';

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
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: PATHS.cms,
    loadComponent: () => 
      import('./pages/cms/cms.component').then(m => m.CmsComponent)
  },
  {
    path: PATHS.todoList,
    loadComponent: () => 
      import('./pages/todo-list/todo-list.component').then(m => m.TodoListComponent)
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];