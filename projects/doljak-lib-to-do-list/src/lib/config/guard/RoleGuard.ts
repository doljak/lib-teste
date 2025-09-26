import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { UserStore } from '../../store/user.store.';
import { PATHS } from '../../doljak-lib-to-do-list.routes';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userStore = inject(UserStore);
  const requiredRole = route.data['roles'] as string[];
  
  const currentUser = userStore.getCurrentUser();
  
  if (!currentUser || !requiredRole.includes(currentUser.profile)) {
    console.log('Access denied - Insufficient privileges');
    return router.createUrlTree([PATHS.todoList]);
  }

  return true;
};