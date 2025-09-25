
import { Routes } from '@angular/router';
import { libRoutes } from '../../../doljak-lib-to-do-list/src/public-api';

export const routes: Routes = [
      {
    path: 'lib',
    children: libRoutes
  }
];
