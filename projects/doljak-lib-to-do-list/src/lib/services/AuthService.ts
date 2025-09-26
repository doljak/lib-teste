import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { UserStore, User } from '../store/UserStore';
import { PATHS } from '../doljak-lib-to-do-list.routes';

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private router: Router,
    private userStore: UserStore
  ) {}

  login(credentials: LoginCredentials): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user`).pipe(
      tap(user => {
        this.userStore.setCurrentUser(user);
        this.router.navigate([PATHS.todoList]);
      })
    );
  }

  logout(): void {
    this.userStore.clearCurrentUser();
    this.router.navigate([PATHS.login]);
  }

  isAuthenticated(): boolean {
    return !!this.userStore.currentUser;
  }
}