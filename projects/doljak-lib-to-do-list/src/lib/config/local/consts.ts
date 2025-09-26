import { InjectionToken } from "@angular/core";

export const LOCAL_VARS = {
    STORAGE_KEY: 'auth_user',
    isLocalhost: window.location.hostname === 'localhost'
}

// Base genérico (fallback para localhost) injection token
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => 'http://localhost:3000'
});