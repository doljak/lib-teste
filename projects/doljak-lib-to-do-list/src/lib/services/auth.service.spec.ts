import { AuthService } from './auth.service';
import { of, throwError } from 'rxjs';
import { PATHS } from '../doljak-lib-to-do-list.routes';

describe('AuthService.isAuthenticated', () => {
  let service: AuthService;
  let userStoreMock: any;
  let httpMock: any;
  let routerMock: any;
  let libEnvMock: any;

  beforeEach(() => {
    userStoreMock = {
      loginStatus$: { value: { isLoggedIn: false } },
      setCurrentUser: jasmine.createSpy('setCurrentUser'),
      setLoginStatus: jasmine.createSpy('setLoginStatus'),
      clearCurrentUser: jasmine.createSpy('clearCurrentUser')
    };
    httpMock = {
      get: jasmine.createSpy('get')
    };
    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };
    libEnvMock = { endpoints: { getUser: '/user', login: '/login' } };

    service = new AuthService(
      httpMock,
      routerMock,
      userStoreMock,
      libEnvMock,
      'http://api'
    );
  });

  it('should return false when loginStatus$.value.isLoggedIn is false', () => {
    userStoreMock.loginStatus$.value.isLoggedIn = false;
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should return true when loginStatus$.value.isLoggedIn is true', () => {
    userStoreMock.loginStatus$.value.isLoggedIn = true;
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return false when loginStatus$.value.isLoggedIn is undefined', () => {
    userStoreMock.loginStatus$.value.isLoggedIn = undefined;
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should return false when loginStatus$ is missing', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('logout should clear user and navigate to login', () => {
    service.logout();
    expect(userStoreMock.clearCurrentUser).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith([PATHS.login]);
  });

  describe('getUserData', () => {
    it('should call http.get with correct endpoint', () => {
      httpMock.get.and.returnValue(of({ id: '1', name: 'Test', email: 't@t.com', profile: 'user' }));
      service['getUserData']().subscribe();
      expect(httpMock.get).toHaveBeenCalledWith('http://api/user');
    });

    it('should fallback to ENDPOINTS.getUser if not in env', () => {
      service = new AuthService(
        httpMock,
        routerMock,
        userStoreMock,
        {},
        'http://api'
      );
      httpMock.get.and.returnValue(of({}));
      service['getUserData']().subscribe();
      expect(httpMock.get).toHaveBeenCalledWith('http://api/user');
    });
  });

  describe('handleAuthenticationSuccess', () => {
    it('should throw error if user is falsy', () => {
      expect(() => service['handleAuthenticationSuccess'](null as any)).toThrowError('User data not found');
    });

    it('should set user and navigate to todoList', () => {
      const user = { id: '1', name: 'Test', email: 't@t.com', profile: 'user' };
      spyOn(console, 'log');
      service['handleAuthenticationSuccess'](user as any);
      expect(userStoreMock.setCurrentUser).toHaveBeenCalledWith(user);
      expect(routerMock.navigate).toHaveBeenCalledWith([PATHS.todoList]);
      expect(console.log).toHaveBeenCalledWith('Authenticated user:', user);
    });
  });

  describe('handleAuthenticationError', () => {
    it('should log error, set login status, navigate to login, and throw', (done) => {
      const error = new Error('fail');
      spyOn(console, 'error');
      service['handleAuthenticationError'](error).subscribe({
        error: (err) => {
          expect(console.error).toHaveBeenCalledWith('Authentication error:', error);
          expect(userStoreMock.setLoginStatus).toHaveBeenCalledWith({ isLoggedIn: true, error: error.message });
          expect(routerMock.navigate).toHaveBeenCalledWith([PATHS.login]);
          expect(err).toBe('fail');
          done();
        }
      });
    });

    it('should handle error with no message', (done) => {
      service['handleAuthenticationError']({}).subscribe({
        error: (err) => {
          expect(err).toBe('Authentication failed');
          done();
        }
      });
    });
  });
});