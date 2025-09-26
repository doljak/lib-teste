import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const libRoutes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'cms',
    loadComponent: () => 
      import('./pages/cms/cms.component').then(m => m.CmsComponent)
  },
  {
    path: 'todo-list',
    loadComponent: () => 
      import('./pages/todo-list/todo-list.component').then(m => m.TodoListComponent)
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];