import { TestBed } from '@angular/core/testing';
import { UserStore } from './user.store';
import { DEV_ENV } from '../config/injection-tokens/api.base.injection.token';
import { User } from '../interfaces/user.interface';
import { LoginStatus } from '../interfaces/login.interface';

describe('UserStore', () => {
  let store: UserStore;
  let localStorageSpy: jasmine.SpyObj<Storage>;
  
  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@test.com',
    profile: 'admin'
  };

  const mockAdminUser: User = {
    ...mockUser,
    profile: 'admin'
  };

  const mockNonAdminUser: User = {
    ...mockUser,
    profile: 'user'
  };

  beforeEach(() => {
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'removeItem']);
    spyOn(window.localStorage, 'getItem').and.callFake(localStorageSpy.getItem);
    spyOn(window.localStorage, 'setItem').and.callFake(localStorageSpy.setItem);
    spyOn(window.localStorage, 'removeItem').and.callFake(localStorageSpy.removeItem);

    TestBed.configureTestingModule({
      providers: [UserStore]
    });
    store = TestBed.inject(UserStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with null user when not localhost', () => {
      spyOnProperty(DEV_ENV, 'isLocalhost').and.returnValue(false);
      expect(store.currentUser$.getValue()).toBeNull();
    });

    it('should initialize with correct login status', () => {
      expect(store.loginStatus$.getValue()).toEqual({ isLoggedIn: false });
    });
  });

  describe('User Management', () => {
    it('should set current user', () => {
      store.setCurrentUser(mockUser);
      expect(store.currentUser$.getValue()).toEqual(mockUser);
      expect(store.loginStatus$.getValue().isLoggedIn).toBeTrue();
    });

    it('should get current user', () => {
      store.setCurrentUser(mockUser);
      expect(store.getCurrentUser()).toEqual(mockUser);
    });

    it('should clear current user', () => {
      store.setCurrentUser(mockUser);
      store.clearCurrentUser();
      expect(store.currentUser$.getValue()).toBeNull();
      expect(store.loginStatus$.getValue().isLoggedIn).toBeFalse();
    });
  });

  describe('Login Status', () => {
    it('should set login status', () => {
      const status: LoginStatus = { isLoggedIn: true };
      store.setLoginStatus(status);
      expect(store.getLoginStatus()).toEqual(status);
    });

    it('should check authentication status', () => {
      store.setLoginStatus({ isLoggedIn: true });
      expect(store.isAuthenticated()).toBeTrue();
    });
  });

  describe('Admin Status', () => {
    it('should detect admin user', (done) => {
      store.setCurrentUser(mockAdminUser);
      store.isAdmin$.subscribe(isAdmin => {
        expect(isAdmin).toBeTrue();
        done();
      });
    });

    it('should detect non-admin user', (done) => {
      store.setCurrentUser(mockNonAdminUser);
      store.isAdmin$.subscribe(isAdmin => {
        expect(isAdmin).toBeFalse();
        done();
      });
    });
  });

  describe('localStorage Interaction', () => {
    beforeEach(() => {
      spyOnProperty(DEV_ENV, 'isLocalhost').and.returnValue(true);
    });

    it('should store user in localStorage when in localhost', () => {
      store.setCurrentUser(mockUser);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        DEV_ENV.STORAGE_KEY,
        JSON.stringify(mockUser)
      );
    });

    it('should remove user from localStorage when clearing', () => {
      store.clearCurrentUser();
      expect(localStorage.removeItem).toHaveBeenCalledWith(DEV_ENV.STORAGE_KEY);
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageSpy.getItem.and.throwError('Storage error');
      expect(() => store.getCurrentUser()).not.toThrow();
    });
  });
});