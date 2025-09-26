import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../interfaces/user.interface';
import { LoginStatus } from '../interfaces/login.interface';
import { LOCAL_VARS } from '../config/local/consts';
//TODO: Integracao com backend
@Injectable({
  providedIn: 'root'
})
export class UserStore {
  
  currentUser$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(
    LOCAL_VARS.isLocalhost ? this.getStoredUser() : null
  );
  
  loginStatus$: BehaviorSubject<LoginStatus> = new BehaviorSubject<LoginStatus>(
    LOCAL_VARS.isLocalhost ? this.getStoredLoginStatus() : { isLoggedIn: false }
  );

  readonly isAdmin$: Observable<boolean> = this.currentUser$.pipe(
    map(user => user?.profile === 'admin')
  );

  private getStoredUser(): User | null {
    if (!LOCAL_VARS.isLocalhost) return null;
    
    try {
      const stored = localStorage.getItem(LOCAL_VARS.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error reading stored user:', error);
      return null;
    }
  }

  private getStoredLoginStatus(): LoginStatus {
    const user = this.getStoredUser();
    return { isLoggedIn: !!user };
  }

  setCurrentUser(user: User): void {
    try {
      if (LOCAL_VARS.isLocalhost) {
        localStorage.setItem(LOCAL_VARS.STORAGE_KEY, JSON.stringify(user));
      }
      this.currentUser$.next(user);
      this.loginStatus$.next({ isLoggedIn: true });
    } catch (error) {
      console.error('Error storing user:', error);
    }
  }

  getCurrentUser(): User | null {
    if (LOCAL_VARS.isLocalhost) {
      const stored = localStorage.getItem(LOCAL_VARS.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    }
    const user = this.currentUser$.getValue();
    console.log('Getting current user from store:', user);
    return user;
  }

  setLoginStatus(status: LoginStatus): void {
    this.loginStatus$.next(status);
    console.log('Login status updated:', status);
  }

  getLoginStatus(): LoginStatus {
    return this.loginStatus$.getValue();
  }

  clearCurrentUser(): void {
    try {
      if (LOCAL_VARS.isLocalhost) {
        localStorage.removeItem(LOCAL_VARS.STORAGE_KEY);
      }
      this.currentUser$.next(null);
      this.loginStatus$.next({ isLoggedIn: false });
      console.log('User store cleared successfully');
    } catch (error) {
      console.error('Error clearing user store:', error);
    }
  }

  isAuthenticated(): boolean {
    return this.loginStatus$.getValue().isLoggedIn;
  }
}