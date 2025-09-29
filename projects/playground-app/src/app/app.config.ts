import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

// modo 1 para substituicao de dominio
import { 
  LIB_ENV, 
  provideLibEnvironment 
} from '../../../doljak-lib-to-do-list/src/lib/config/injection-tokens/api.base.injection.token';

//modo 2 para substituicao de dominio via grupo ou individualmente
import { API_BASE_URL } from '../../../doljak-lib-to-do-list/src/lib/config/injection-tokens/api.base.injection.token';
import { 
  TODO_API_URL, 
  CMS_API_URL,
  AUTH_API_URL,
  provideApiUrls
} from '../../../doljak-lib-to-do-list/src/lib/config/injection-tokens/domain.injection.tokens';

import { environment } from '../../environments/environment';
import { LibEnvironment } from '../../../doljak-lib-to-do-list/src/lib/interfaces/lib.enviroment.interface';
import { libRoutes } from '../../../doljak-lib-to-do-list/src/lib/doljak-lib-to-do-list.routes';

const LIB_ENV_VALUE:LibEnvironment = {
  //apiBaseUrl: environment.apiBaseUrl,
  endpoints: environment.endpoints
};


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(libRoutes),

    // modo 1 para substituicao de dominio
    //...provideLibEnvironment(LIB_ENV_VALUE),
    { provide: LIB_ENV, useValue: LIB_ENV_VALUE },

    // ou modo 2, via grupo ou individualmente
    // via grupo - passando URLs específicas para cada serviço
    // ...provideApiUrls({
    //   baseUrl: 'https://api.default.com',        // fallback
    //   todoBaseUrl: 'https://todo.api.com',
    //   cmsBaseUrl: 'https://cms.api.com',
    //   authBaseUrl: 'https://auth.api.com'
    // })

    // individualmente - definindo diretamente via providers especificamente
    { provide: API_BASE_URL, useValue: 'http://localhost:3000' },
    // { provide: TODO_API_URL, useValue: 'https://todo.api.com' },
    //{ provide: CMS_API_URL, useValue: 'https://cms.api.com' },
    // { provide: AUTH_API_URL, useValue: 'https://auth.api.com' },
    
    
  ]
};
