import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { 
  LIB_ENV,
  libRoutes, 
  provideLibEnvironment 
} from '../../../doljak-lib-to-do-list/src/public-api';

import { environment } from '../../environments/environment';
import { LibEnvironment } from '../../../doljak-lib-to-do-list/src/lib/interfaces/lib.enviroment.interface';

const LIB_ENV_VALUE:LibEnvironment = {
  apiBaseUrl: environment.apiBaseUrl,
  endpoints: environment.endpoints
};


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(libRoutes),

    // passando URLs específicas para cada serviço

    // ...provideApiUrls({
    //   baseUrl: 'https://api.default.com',        // fallback
    //   todoBaseUrl: 'https://todo.api.com',
    //   cmsBaseUrl: 'https://cms.api.com',
    //   authBaseUrl: 'https://auth.api.com'
    // })

    // Ou definindo diretamente via providers especificamente

    // { provide: API_BASE_URL, useValue: 'http://localhost:3000' },
    // { provide: TODO_API_URL, useValue: 'https://todo.api.com' },
    //{ provide: CMS_API_URL, useValue: 'https://cms.api.com' },
    // { provide: AUTH_API_URL, useValue: 'https://auth.api.com' },
    
    // Ou usando o padrão (herdam de API_BASE_URL) para todos

    ...provideLibEnvironment(LIB_ENV_VALUE),

    //{ provide: LIB_ENV, useValue: LIB_ENV_VALUE }
  ]
};
