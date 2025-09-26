import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

import { map } from 'rxjs/operators';
import { UserStore } from '../../store/UserStore';
import { PATHS } from '../../doljak-lib-to-do-list.routes';

export const authGuard: CanActivateFn = (route, state) => {
  const userStore = inject(UserStore);
  const router = inject(Router);

  return userStore.currentUser$.pipe(
    map(user => {
      if (user) {
        return true;
      }
      return router.createUrlTree([PATHS.login]);
    })
  );
};