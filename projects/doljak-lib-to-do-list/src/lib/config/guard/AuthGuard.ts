import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { UserStore } from '../../store/user.store.';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userStore = inject(UserStore);
  const isLocalhost = window.location.hostname === 'localhost';
  const STORAGE_KEY = 'auth_user';

  if (isLocalhost) {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      userStore.setCurrentUser(user);
      return true;
    }
  }

  if (!userStore.getLoginStatus().isLoggedIn) {
    console.log('User not authenticated, redirecting to login');
    return router.createUrlTree(['/login']);
  }
  // TODO: integracao com backend
  return true;
};