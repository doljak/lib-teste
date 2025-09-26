import { Injectable, signal } from '@angular/core';
import { computed } from '@angular/core';

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
  private readonly _currentUser = signal<User | null>(null);

  // Public selectors
  readonly currentUser = computed(() => this._currentUser());
  readonly isAdmin = computed(() => this._currentUser()?.profile === 'admin');

  // Actions
  setCurrentUser(user: User) {
    this._currentUser.set(user);
  }

  clearCurrentUser() {
    this._currentUser.set(null);
  }
}