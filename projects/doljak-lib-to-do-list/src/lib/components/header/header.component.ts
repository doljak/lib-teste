import { AfterContentInit, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStore } from '../../store/user.store';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { PATHS } from '../../doljak-lib-to-do-list.routes';
import { filter, map, startWith } from 'rxjs';

@Component({
  selector: 'lib-header',
  standalone: true,
  imports: [CommonModule],
  providers: [UserStore, AuthService],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterContentInit {
  private authService = inject(AuthService);
  private userStore = inject(UserStore);
  private router = inject(Router);

  name = this.userStore.getCurrentUser()?.name || '';
  isAdmin$ = this.userStore.isAdmin$;
  currentUrl$ = this.router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    map(() => this.router.url),
    startWith(this.router.url)
  );
  isOnAdminRoute$ = this.currentUrl$.pipe(map(url => url.startsWith('/cms')));

  ngAfterContentInit(): void {
    console.log('Current User:', this.userStore.getCurrentUser());
    console.log('Login Status:', this.userStore.getLoginStatus());
  }

  navigateToAdmin(): void {
    this.router.navigate([PATHS.cms]);
  }

  navigateToTasks(): void {
    this.router.navigate([PATHS.todoList]);
  }

  logout(): void {
    this.authService.logout();
  }
}