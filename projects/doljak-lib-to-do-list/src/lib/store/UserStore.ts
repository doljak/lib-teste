import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  id: string;
  name: string;
  email: string;
  profile: 'admin' | 'user';
}

@Injectable({
  providedIn: 'root'
})
export class UserStore {
  // Private state
  private readonly _currentUser = new BehaviorSubject<User | null>(null);

  // Public selectors
  readonly currentUser$: Observable<User | null> = this._currentUser.asObservable();
  readonly isAdmin$: Observable<boolean> = this.currentUser$.pipe(
    map(user => user?.profile === 'admin')
  );

  // Getters for current values
  get currentUser(): User | null {
    return this._currentUser.getValue();
  }

  get isAdmin(): boolean {
    return this.currentUser?.profile === 'admin';
  }

  // Actions
  setCurrentUser(user: User): void {
    this._currentUser.next(user);
  }

  clearCurrentUser(): void {
    this._currentUser.next(null);
  }
}