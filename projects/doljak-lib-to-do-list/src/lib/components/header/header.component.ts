import { AfterContentInit, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStore } from '../../store/user.store';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { PATHS } from '../../doljak-lib-to-do-list.routes';

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

  name = this.userStore.getCurrentUser()?.name || 'Guest';
  isAdmin$ = this.userStore.isAdmin$;

  ngAfterContentInit(): void {
    console.log('Current User:', this.userStore.getCurrentUser());
    console.log('Login Status:', this.userStore.getLoginStatus());
  }

  navigateToAdmin(): void {
    this.router.navigate([PATHS.cms]);
  }

  logout(): void {
    this.authService.logout();
  }
}