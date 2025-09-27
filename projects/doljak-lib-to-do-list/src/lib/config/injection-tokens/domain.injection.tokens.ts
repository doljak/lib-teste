import { inject, InjectionToken, Provider } from '@angular/core';
import { ApiUrlConfig } from '../../interfaces/api.url.config.interface';
import { API_BASE_URL } from './api.base.injection.token';


// Tokens por serviço. Por padrão, herdam de API_BASE_URL.
export const TODO_API_URL = new InjectionToken<string>('TODO_API_URL', {
  providedIn: 'root',
  factory: () => inject(API_BASE_URL)
});

export const CMS_API_URL = new InjectionToken<string>('CMS_API_URL', {
  providedIn: 'root',
  factory: () => inject(API_BASE_URL)
});

export const AUTH_API_URL = new InjectionToken<string>('AUTH_API_URL', {
  providedIn: 'root',
  factory: () => inject(API_BASE_URL)
});

// Opção para configurar facilmente via providers no app host (MFE)
export function provideApiUrls(config: Partial<ApiUrlConfig>): Provider[] {
  const providers: Provider[] = [];

  if (config.baseUrl) {
    providers.push({ provide: API_BASE_URL, useValue: config.baseUrl });
  }
  if (config.todoBaseUrl) {
    providers.push({ provide: TODO_API_URL, useValue: config.todoBaseUrl });
  }
  if (config.cmsBaseUrl) {
    providers.push({ provide: CMS_API_URL, useValue: config.cmsBaseUrl });
  }
  if (config.authBaseUrl) {
    providers.push({ provide: AUTH_API_URL, useValue: config.authBaseUrl });
  }

  return providers;
}