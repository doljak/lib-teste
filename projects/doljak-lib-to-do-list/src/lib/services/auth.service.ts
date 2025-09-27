import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
;
import { Observable, throwError } from 'rxjs';
import { switchMap, tap, catchError, map } from 'rxjs/operators';
import { UserStore } from '../store/user.store';
import { User } from '../interfaces/user.interface';
import { LoginCredentials, LoginStatus } from '../interfaces/login.interface';
import { PATHS } from '../doljak-lib-to-do-list.routes';
import { AUTH_API_URL } from '../config/injection-tokens/domain.injection.tokens';
import { LIB_ENV, ENDPOINTS } from '../config/injection-tokens/api.base.injection.token';
import { LibEnvironment } from '../interfaces/lib.enviroment.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private router: Router,
    private userStore: UserStore,
    @Inject(LIB_ENV) private readonly baseUrl: LibEnvironment,
    @Inject(AUTH_API_URL) private readonly authBase: string
  ) { }

  login(credentials: any): Observable<any> {
    return this.validateCredentials(credentials).pipe(
      switchMap((loginStatus: any) => {
        if (loginStatus?.isLoggedIn) {
          return this.getUserData().pipe(
            map(user => {
              this.handleAuthenticationSuccess(user);
              return loginStatus;
            }),
            catchError(err => this.handleAuthenticationError(err))
          );
        }
        return throwError(() => new Error('Invalid credentials'));
      }),
      catchError(err => {
        this.router.navigate(['/login']);
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    this.userStore.clearCurrentUser();
    this.router.navigate([PATHS.login]);
  }

  isAuthenticated(): boolean { 
    return this.userStore.loginStatus$.value.isLoggedIn || false;
  }

  private validateCredentials(credentials: LoginCredentials): Observable<LoginStatus> {
    console.log('Validating credentials:', this.baseUrl)
    const loginEndpoint = this.baseUrl.endpoints?.login || ENDPOINTS.login;
    return this.http.get<LoginStatus>(`${this.authBase}${loginEndpoint}`).pipe(
      tap(response => {
        console.log('Login response:', response);
        this.userStore.setLoginStatus(response);
      })
    );
  }

  private getUserData(): Observable<User> {
    const userEndpoint = this.baseUrl.endpoints?.getUser || ENDPOINTS.getUser;
    return this.http.get<User>(`${this.authBase}${userEndpoint}`);
  }

  private handleAuthenticationSuccess(user: User): void {
    if (!user) {
      throw new Error('User data not found');
    }
    console.log('Authenticated user:', user);
    this.userStore.setCurrentUser(user);
    this.router.navigate([PATHS.todoList]);
  }

  private handleAuthenticationError(error: any): Observable<never> {
    console.error('Authentication error:', error);
    this.userStore.setLoginStatus({ isLoggedIn: true, error: error?.message });
    this.router.navigate([PATHS.login]);
    return throwError(() => error?.message || 'Authentication failed');
  }
}