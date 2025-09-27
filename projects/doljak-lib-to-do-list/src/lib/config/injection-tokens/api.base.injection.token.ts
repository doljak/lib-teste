import { inject, InjectionToken, Provider } from "@angular/core";
import { LibEnvironment } from "../../interfaces/lib.enviroment.interface";

export const DEV_ENV = {
  STORAGE_KEY: 'auth_user',
  isLocalhost: window.location.hostname === 'localhost'
}

export const API_BASE_URL_LOCALHOST = 'http://localhost:3000';

export const ENDPOINTS = {
  getUsers: '/users',
  getUser: '/user',
  login: '/login',
  getTodos: '/todos'
};

// Base genérico (fallback para localhost) injection token
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => inject(LIB_ENV).apiBaseUrl
});

export const LIB_ENV = new InjectionToken<LibEnvironment>('LIB_ENV', {
  providedIn: 'root',
  factory: (): LibEnvironment => ({
    apiBaseUrl: API_BASE_URL_LOCALHOST,
    endpoints: ENDPOINTS
  })
});

export function provideLibEnvironment(env: Partial<LibEnvironment>): Provider[] {
  return [
    {
      provide: LIB_ENV,
      useValue: {
        apiBaseUrl: env.apiBaseUrl ?? API_BASE_URL_LOCALHOST,
        endpoints: env.endpoints ?? ENDPOINTS
      } as LibEnvironment
    }
  ];
}
